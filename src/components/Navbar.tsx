import AppBar from "@mui/material/AppBar";
import IconButton from "@mui/material/IconButton";
import Toolbar from "@mui/material/Toolbar";
import ListAltIcon from '@mui/icons-material/ListAlt';
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

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
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    ToDo App
                </Typography>
                <Box>
                    {!user ? (
                        <>
                            <Button
                                sx={{marginInline: 1}}
                                color="inherit" 
                                onClick={() => navigate('/sign-in')} 
                                variant="outlined"
                            >
                                SIGN IN
                            </Button>
                            <Button 
                                sx={{backgroundColor: 'white'}}
                                onClick={() => navigate('/sign-up')} 
                                variant="outlined"
                            >
                                SIGN UP
                            </Button>
                        </>
                    ) : (
                            <Button
                                sx={{ backgroundColor: 'error.main', color: 'white'}}
                                onClick={handleSignOut}
                                variant="contained"
                            >
                                SIGN OUT
                            </Button>
                    )}
                </Box>
            </Toolbar>
        </AppBar>
    );
}