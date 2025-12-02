import AppBar from "@mui/material/AppBar";
import IconButton from "@mui/material/IconButton";
import Toolbar from "@mui/material/Toolbar";
import ListAltIcon from '@mui/icons-material/ListAlt';
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LogoutIcon from '@mui/icons-material/Logout';

export const Navbar = () => {
    const navigate = useNavigate();
    const { user, signOut } = useAuth();

    const handleSignOut = async () => {
        try {
            await signOut();
            navigate('/'); 
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

    return (
        <AppBar position="static">
            <Toolbar>
                <IconButton edge="start" color="inherit" aria-label="menu" onClick={() => navigate('/')}>
                    <ListAltIcon />
                </IconButton>
                
                <Typography variant="h6" component="div" sx={{ mr: 4 }}>
                    ToDo App
                </Typography>

                <Box sx={{ flexGrow: 1, display: 'flex', gap: 3 }}>
                    {user && (
                        <>
                            <Typography 
                                variant="button" 
                                component="div" 
                                onClick={() => navigate('/dashboard')}
                                sx={{ 
                                    cursor: 'pointer', 
                                    opacity: 0.8,
                                    '&:hover': { opacity: 1, textDecoration: 'underline' },
                                    textTransform: 'none',
                                    fontWeight: 500
                                }}
                            >
                                Dashboard
                            </Typography>

                            <Typography 
                                variant="button" 
                                component="div" 
                                onClick={() => navigate('/all-tasks')}
                                sx={{ 
                                    cursor: 'pointer', 
                                    opacity: 0.8,
                                    '&:hover': { opacity: 1, textDecoration: 'underline' },
                                    textTransform: 'none',
                                    fontWeight: 500
                                }}
                            >
                                All Tasks
                            </Typography>

                            <Typography 
                                variant="button" 
                                component="div" 
                                onClick={() => navigate('/goals')}
                                sx={{ 
                                    cursor: 'pointer', 
                                    opacity: 0.8,
                                    '&:hover': { opacity: 1, textDecoration: 'underline' },
                                    textTransform: 'none',
                                    fontWeight: 500
                                }}
                            >
                                Goals
                            </Typography>
                        </>
                    )}
                </Box>

                <Box>
                    {!user ? (
                        <>
                            <Button
                                sx={{ marginInline: 1 }}
                                color="inherit" 
                                onClick={() => navigate('/sign-in')} 
                                variant="outlined"
                            >
                                SIGN IN
                            </Button>
                            <Button 
                                sx={{ backgroundColor: 'white', color: 'primary.main' }}
                                onClick={() => navigate('/sign-up')} 
                                variant="contained"
                            >
                                SIGN UP
                            </Button>
                        </>
                    ) : (
                         <Typography 
                            variant="button" 
                            component="div"
                            onClick={handleSignOut}
                            sx={{ 
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                transition: 'color 0.2s', // Smooth transition
                                '&:hover': { color: '#ff5252' } // Correct syntax: '&:hover'
                            }}
                        >
                            <LogoutIcon />
                        </Typography>
                    )}
                </Box>
            </Toolbar>
        </AppBar>
    );
}