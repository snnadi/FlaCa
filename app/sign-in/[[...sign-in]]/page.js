'use client'


import React from 'react'
import { Container, Box, Typography, AppBar, Toolbar, Button, ThemeProvider, createTheme, CssBaseline } from '@mui/material'
import { SignIn } from '@clerk/nextjs'
import Link from 'next/link'

const darkTheme = createTheme({
    palette:{
        mode: 'dark',
    },
})


export default function SignInPage() {
    return (
        <ThemeProvider theme={darkTheme}> <CssBaseline/> 
            <Container maxWidth='100vw'>
                <AppBar position='static'>
                    <Toolbar>
                        <Typography variant='h6' sx={{ flexGrow: 1 }}>FlaCa</Typography>
                        <Button color='inherit' href='/'>Home</Button>
                    </Toolbar>
                </AppBar>
                    <Box display='flex' flexDirection='column' alignItems='center' justifyContent='center' height = '80vh'>
                            <SignIn />
                    </Box>
            </Container>
        </ThemeProvider>
    )
}