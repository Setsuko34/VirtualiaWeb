// src/components/OldMapModal.tsx
import React from 'react';
import { Modal, Box, Typography, Link } from '@mui/material';
import { Download } from 'lucide-react';

interface OldMapModalProps {
    openDownload: boolean;
    setOpenDownload: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function OldMapModal({ openDownload, setOpenDownload }: OldMapModalProps) {
    return (
        <Modal
            open={openDownload}
            onClose={() => setOpenDownload(false)}
            aria-labelledby="download-map-s1-title"
            BackdropProps={{
                sx: { backgroundColor: 'rgba(0,0,0,0.7)' }
            }}
        >
            <Box
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    bgcolor: 'rgba(12,12,16,0.95)', // fond sombre
                    color: '#F8FAFC', // texte clair
                    borderRadius: 2,
                    border: '1px solid rgba(124,58,237,0.28)', // bordure violette translucide
                    boxShadow: 24,
                    p: 4,
                    width: 360,
                }}
            >
                <Typography id="download-map-s1-title" variant="h6" component="h2" sx={{ mb: 1 }}>
                    Télécharger l'ancienne map
                </Typography>
                <Link
                    href="https://drive.google.com/file/d/1wBcGYWbpz99oU99GB7YlmBs91TOegZS8/view"
                    target="_blank"
                    rel="noopener noreferrer"
                    download
                    sx={{
                        fontSize: 16,
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 1.5,
                        width: '100%',
                        marginBottom: 2,
                        color: 'rgba(203,213,225,1)', // légèrement clair
                        textDecoration: 'none',
                    }}
                >
                    <Download color="#A78BFA" size={18} />
                    <span style={{ color: '#EDE9FE', fontWeight: 500 }}>Saison 1</span>
                </Link>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                    <button
                        onClick={() => setOpenDownload(false)}
                        className="px-3 py-2 rounded-md text-sm bg-gray-700 hover:bg-gray-600 text-gray-100"
                    >
                        Annuler
                    </button>
                </div>
            </Box>
        </Modal>
    );
}