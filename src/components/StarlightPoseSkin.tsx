import React, { useMemo, useState, useEffect } from "react";

/**
 * StarlightPoseSkin
 * - Rend un skin complet via l'API Starlight Skins avec des poses variées.
 * - Route: https://starlightskins.lunareclipse.studio/render/:type/:playerOrUuid/:crop
 * - Support URL brute (si skin hébergé en HTTPS public): /render/:type/url/:encodedUrl/:crop
 */
export type StarlightPoseSkinProps = {
  username: string; // Pseudo ou UUID
  width?: number;
  height?: number;
  className?: string;
  // Départ dans la liste des poses pour varier entre cartes
  initialPoseIndex?: number;
  // Forcer une pose précise (sinon on essaie une liste de poses prédéfinies)
  poseType?: string;
  // URL absolue d'un skin (HTTPS public) à utiliser côté Starlight (prioritaire)
  skinAbsoluteUrl?: string; // ex: https://dev.vtvirtualia.fr/skin/<name>.png
  // Si true, tente automatiquement d'utiliser un skin local sous /public selon localPathPattern (prod HTTPS uniquement)
  preferLocalSkin?: boolean;
  // Pattern du chemin local (remplace {username})
  localPathPattern?: string; // ex: "/skin/{username}.png"
};

const BASE = "https://starlightskins.lunareclipse.studio";
const CROP = "full";

// Poses candidates; ordre = compatibilité + variété
const POSE_TYPES = [
    "criss-cross",
    "relaxing",
    "cheering",
    "trudging",
    "lunging",
    "dungeons",
    "kicking",
    "archer"
];

function canUseExternal(url?: string): boolean {
  if (!url) return false;
  try {
    const u = new URL(url);
    if (u.hostname === "localhost" || u.hostname === "127.0.0.1") return false;
    return u.protocol === "https:";
  } catch {
    return false;
  }
}

function buildUrl(type: string, username: string, skinAbsoluteUrl?: string): string {
  if (canUseExternal(skinAbsoluteUrl)) {
    const encoded = encodeURIComponent(skinAbsoluteUrl as string);
    return `${BASE}/render/${encodeURIComponent(type)}/url/${encoded}/${CROP}`;
  }
  return `${BASE}/render/${encodeURIComponent(type)}/${encodeURIComponent(username)}/${CROP}`;
}

export const StarlightPoseSkin: React.FC<StarlightPoseSkinProps> = ({
  username,
  width = 200,
  height = 250,
  className = "",
  initialPoseIndex = 0,
  poseType,
  skinAbsoluteUrl,
  preferLocalSkin = true,
  localPathPattern = "/skin/{username}.png",
}) => {
  const [poseIdx, setPoseIdx] = useState<number>(() => {
    if (poseType) return 0;
    return Math.abs(initialPoseIndex) % POSE_TYPES.length;
  });
  const [errorCount, setErrorCount] = useState(0);
  const [loaded, setLoaded] = useState(false);

  const effectivePose = poseType ?? POSE_TYPES[poseIdx];

  // Détermine automatiquement une URL absolue HTTPS vers /skin/{username}.png en prod HTTPS
  const autoLocalAbsoluteUrl = useMemo(() => {
    if (skinAbsoluteUrl) return skinAbsoluteUrl; // priorité à la prop explicite
    if (!preferLocalSkin) return undefined;
    if (typeof window === "undefined") return undefined;
    try {
      const { origin } = window.location;
      const url = new URL(origin);
      if (url.protocol !== "https:" || url.hostname === "localhost" || url.hostname === "127.0.0.1") {
        return undefined;
      }
      const path = localPathPattern.replace("{username}", encodeURIComponent(username));
      return `${origin}${path.startsWith("/") ? "" : "/"}${path}`;
    } catch {
      return undefined;
    }
  }, [skinAbsoluteUrl, preferLocalSkin, localPathPattern, username]);

  // Fallback final si toutes les poses échouent
  const fallbackBody = `https://mc-heads.net/body/${encodeURIComponent(username)}.png`;
  const [finalSrc, setFinalSrc] = useState("");

  // Recalcule la source à chaque changement pertinent
  useEffect(() => {
    setLoaded(false);
    setErrorCount(0);
    const next = buildUrl(effectivePose, username, autoLocalAbsoluteUrl);
    setFinalSrc(next);
  }, [effectivePose, username, autoLocalAbsoluteUrl]);

  const onError = () => {
    if (poseType) {
      setFinalSrc(fallbackBody);
      setLoaded(true);
      return;
    }
    const nextErr = errorCount + 1;
    setErrorCount(nextErr);
    if (nextErr >= POSE_TYPES.length) {
      setFinalSrc(fallbackBody);
      setLoaded(true);
    } else {
      setPoseIdx((i) => (i + 1) % POSE_TYPES.length);
    }
  };

  return (
    <div className={`relative ${className}`} style={{ width, height }}>
      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-purple-900/20 rounded-lg">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400" />
        </div>
      )}
      <img
        src={finalSrc}
        alt={username}
        width={width}
        height={height}
        loading="lazy"
        decoding="async"
        style={{ width: "100%", height: "100%", objectFit: "contain", imageRendering: "pixelated" as any, display: loaded ? "block" : "block", borderRadius: 8 }}
        onLoad={() => setLoaded(true)}
        onError={onError}
      />
    </div>
  );
};

export default StarlightPoseSkin;

