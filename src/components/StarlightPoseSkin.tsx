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

function buildUrl(type: string, username: string, skinAbsoluteUrl?: string): string {
  return `${BASE}/render/${encodeURIComponent(type)}/${encodeURIComponent(username)}/${CROP}`;
}

export const StarlightPoseSkin: React.FC<StarlightPoseSkinProps> = ({
  username,
  width = 200,
  height = 250,
  className = "",
  initialPoseIndex = 0,
  poseType
}) => {
  const [poseIdx, setPoseIdx] = useState<number>(() => {
    if (poseType) return 0;
    return Math.abs(initialPoseIndex) % POSE_TYPES.length;
  });
  const [errorCount, setErrorCount] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [finalSrc, setFinalSrc] = useState("");


    const effectivePose = poseType ?? POSE_TYPES[poseIdx];
  const maxAttempts = poseType ? 1 : POSE_TYPES.length;

  // Fallback final si toutes les poses échouent
  const fallbackBody = `https://mc-heads.net/body/${encodeURIComponent(username)}.png`;

    // Réinitialise uniquement quand la cible change
    useEffect(() => {
        setPoseIdx(poseType ? 0 : Math.abs(initialPoseIndex) % POSE_TYPES.length);
        setErrorCount(0);
    }, [username, poseType, initialPoseIndex]);
  // Recalcule la source à chaque changement pertinent
  useEffect(() => {
    setLoaded(false);
    setFinalSrc(buildUrl(effectivePose, username));
  }, [effectivePose, username, ]);

    const onError = () => {
        const nextErr = errorCount + 1;
        setErrorCount(nextErr);

        if (nextErr >= maxAttempts) {
            setFinalSrc(fallbackBody);
            return;
        }
        if (!poseType) {
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

