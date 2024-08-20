'use client'
import {useUser, SignedIn, SignedOut, UserButton} from "@clerk/nextjs";
import {useEffect, useState} from 'react'
import {collection, doc, setDoc, getDoc} from 'firebase/firestore'
import {db} from '@/firebase'
import {useRouter} from 'next/navigation'
import {Container, Grid, Card, CardActionArea, CardContent, Typography, Button, AppBar, Toolbar, ThemeProvider, createTheme, CssBaseline} from '@mui/material'

const darkTheme = createTheme({
    palette:{
        mode: 'dark',
    },
  })

export default function Flashcards() { 
    const {isLoaded, isSignedIn, user} = useUser()
    const [flashcards, setFlashcards] = useState([])
    const router = useRouter()

    useEffect(() => {
        async function getFlashcards() {
            if (!user) return
            const docRef = doc(collection(db, 'users'), user.id)
            const docSnap = await getDoc(docRef)
            if (docSnap.exists()) {
                const collections = docSnap.data().flashcards || []
                setFlashcards(collections)
            }
            else {
                await setDoc(docRef, {
                    flashcards: []
                })
            }
        }
        getFlashcards()
    }, [user])

    if (!isLoaded || !isSignedIn) {
    return <></>
    }

    const handleCardClick = (id) => {
        router.push(`/flashcard?id=${id}`)
    }

    return( 
    <ThemeProvider theme={darkTheme}>
        <CssBaseline/> 
        <Container maxWidth="100vw">
            <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" style={{ flexGrow: 1 }}> FlaCa </Typography>
                <SignedOut>
                    <Button color="inherit" href="/sign-in"> Login</Button>
                    <Button color="inherit" href="/sign-up"> Sign Up</Button>
                </SignedOut>
                <SignedIn>
                    <Button color='inherit' href='/'> Home </Button>
                    <UserButton />
                </SignedIn>
            </Toolbar>
            </AppBar>

            <Grid container spacing = {3} sx = {{ mt: 4 }}>
                {flashcards.map((flashcard, index) => (
                    <Grid item xs = {12} md = {6} lg = {4} key = {index}>
                        <Card>
                            <CardActionArea onClick = {() => {handleCardClick(flashcard.name)}}>
                                <CardContent>
                                    <Typography variant = "h6" >{flashcard.name}</Typography>
                                </CardContent>
                            </CardActionArea>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Container>
    </ThemeProvider>
)}