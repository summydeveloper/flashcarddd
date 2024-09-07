import { ClerkProvider, SignUp } from "@clerk/nextjs";
import { AppBar, Button, Container, Toolbar, Typography , Box} from "@mui/material";
import Link from "next/link";

export default function SignupPage(){
    return (
         
        <Container maxWidth="100vw">
            <AppBar position="static" sx={{backgroundColor:"#3f151bf" }}>
                <Toolbar>
                    <Typography variant="h6" sx={{
                        flexGrow: 1
                    }}>Flashcard SAAS</Typography>
                    <Button color="inherit" ><Link href="/sign-in" passHref>Login</Link></Button>
                    <Button color="inherit" ><Link href="/sign-up" passHref>Sign Up</Link></Button>

                </Toolbar>
            </AppBar>
            <Box display="flex" flexDirection="column" alignItems= "center" justifyContent= "center">
                    <Typography variant="h4">Sign UP</Typography>
                    <SignUp/>
            </Box>

        </Container> 
    );
}