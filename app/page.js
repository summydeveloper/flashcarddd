"use client";

import getStripe from "@/utils/get-stripe";
import { AppBar, Button, Container, Toolbar, Typography, Box, Grid, Card, CardContent, CardActions } from "@mui/material";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Head from "next/head";
import { useState } from 'react';

export default function Home() {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await fetch('api/checkout_sessions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Origin': 'https://localhost:3000'
        }
      });
      const checkoutSession = await response.json();
      
      if (response.status !== 200) {
        console.error('Error:', checkoutSession.message || 'Unknown error');
        return;
      }
      
      const stripe = await getStripe();
      const { error } = await stripe.redirectToCheckout({
        sessionId: checkoutSession.id
      });
      
      if (error) {
        console.warn('Stripe error:', error.message);
      }
    } catch (error) {
      console.error('Unexpected error:', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg">
      <Head>
        <title>Flashcard SaaS</title>
        <meta name="description" content="Create flashcards from text in seconds" />
      </Head>

      {/* AppBar Component */}
      <AppBar position="static" sx={{ mb: 4 }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Flashcard SaaS
          </Typography>
          <SignedOut>
            <Button color="inherit" href="/sign-in">Login</Button>
            <Button color="inherit" href="/sign-up">Sign Up</Button>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </Toolbar>
      </AppBar>

      {/* Hero Section */}
      <Box
        sx={{
          position: 'relative',
          backgroundImage: 'url(/hero-image.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          color: 'white',
          textAlign: 'center',
          py: 8,
          mb: 6
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'rgba(0, 0, 0, 0.5)', // Semi-transparent dark overlay
            zIndex: 1
          }}
        />
        <Box
          sx={{
            position: 'relative',
            zIndex: 2
          }}
        >
          <Typography variant="h1" sx={{ fontWeight: 'bold', mb: 2, textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)' }}>
            Welcome to Flashcard SaaS
          </Typography>
          <Typography variant="h5" sx={{ mb: 4, textShadow: '1px 1px 3px rgba(0, 0, 0, 0.5)' }}>
            The easiest way to create flashcards
          </Typography>
          <Button variant="contained" color="secondary" sx={{ px: 4, py: 2 }} href="/generate">Get Started</Button>
        </Box>
      </Box>

      {/* Features Section */}
      <Box sx={{ my: 6 }}>
        <Typography variant="h4" gutterBottom align="center">Features</Typography>
        <Grid container spacing={4} justifyContent="center">
          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h6" component="div">Easy Text Input</Typography>
                <Typography variant="body2">Simply input your text and let our software do the rest. Creating flashcards just got easier.</Typography>
              </CardContent>
              <CardActions>
                <Button size="small" color="primary">Learn More</Button>
              </CardActions>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h6" component="div">Smart Flashcards</Typography>
                <Typography variant="body2">Automatically generate smart flashcards from your input text. It's never been easier.</Typography>
              </CardContent>
              <CardActions>
                <Button size="small" color="primary">Learn More</Button>
              </CardActions>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h6" component="div">Accessible Anywhere</Typography>
                <Typography variant="body2">Access your flashcards from anywhere. All you need is an internet connection.</Typography>
              </CardContent>
              <CardActions>
                <Button size="small" color="primary">Learn More</Button>
              </CardActions>
            </Card>
          </Grid>
        </Grid>
      </Box>

      {/* Pricing Section */}
      <Box sx={{ my: 6 }}>
        <Typography variant="h4" gutterBottom align="center">Pricing</Typography>
        <Grid container spacing={4} justifyContent="center">
          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ textAlign: 'center', border: '1px solid #ddd' }}>
              <CardContent>
                <Typography variant="h5" gutterBottom>BASIC</Typography>
                <Typography variant="h6">$5 / month</Typography>
                <Typography>Access to basic features with limited storage.</Typography>
              </CardContent>
              <CardActions>
                <Button variant="contained" color="primary" sx={{ width: '100%' }}>Choose Basic</Button>
              </CardActions>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ textAlign: 'center', border: '1px solid #ddd' }}>
              <CardContent>
                <Typography variant="h5" gutterBottom>PRO</Typography>
                <Typography variant="h6">$10 / month</Typography>
                <Typography>Access to all features with unlimited storage.</Typography>
              </CardContent>
              <CardActions>
                <Button
                  variant="contained"
                  color="secondary"
                  sx={{ width: '100%' }}
                  onClick={handleSubmit}
                  disabled={loading}
                >
                  {loading ? 'Processing...' : 'Choose Pro'}
                </Button>
              </CardActions>
            </Card>
          </Grid>
        </Grid>
      </Box>

      {/* CTA Section */}
      <Box
        sx={{
          backgroundColor: '#f5f5f5',
          py: 6,
          textAlign: 'center',
          borderRadius: 2,
          mb: 4
        }}
      >
        <Typography variant="h4" gutterBottom>Ready to get started?</Typography>
        <Typography variant="body1" gutterBottom>Sign up today and start creating your flashcards in seconds!</Typography>
        <Button variant="contained" color="secondary" href="/generate">Get Started</Button>
      </Box>

      {/* Footer Section */}
      <Box
        sx={{
          backgroundColor: '#333',
          color: 'white',
          py: 3,
          textAlign: 'center'
        }}
      >
        <Typography variant="body2" gutterBottom>&copy; 2024 Flashcard SaaS built by summydev. All rights reserved.</Typography>
        <Typography variant="body2">
          <a href="/privacy-policy" style={{ color: 'white', textDecoration: 'none', margin: '0 10px' }}>Privacy Policy</a>|
          <a href="/terms" style={{ color: 'white', textDecoration: 'none', margin: '0 10px' }}>Terms of Service</a>
        </Typography>
      </Box>
    </Container>
  );
}
