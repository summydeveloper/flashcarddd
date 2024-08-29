"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useSearchParams } from "next/navigation"
import getStripe from "@/utils/get-stripe"
import { Box, CircularProgress, Container, Typography } from "@mui/material"

const Resultpage = () => {
    const router = useRouter()
    const searchParams = useSearchParams()
    const session_id = searchParams.get('session_id')

    const [loading, setLoading] = useState(true)
    const [session, setSession] = useState(null)
    const [error, setError] = useState(null)
    useEffect(() => {
        const fetchCheckoutSession = async () => {
            if (!session_id) return
            try {
                const res = await fetch(`api/checkout_sessions?session_id=${session_id}`)
                const sessionData = res.json()
                if (res.ok) {
                    setSession(sessionData)
                } else {
                    setError(sessionData.error)
                }
            } catch (err) {
                setError('An error ocurred')

            }
            finally {
                setLoading(false)
            }
        }
        fetchCheckoutSession()
    }, [session_id])
    if (loading) {
        return (
            <Container maxWidth="100vw" sx={{
                textAlign: "center", mt: 4
            }}>
                <CircularProgress />
                <Typography variant="h6">
                    Loading....
                </Typography>
            </Container>
        )
    }
    if (error) {
        return (
            <Container maxWidth="100vw" sx={{
                textAlign: "center", mt: 4
            }}>

                <Typography variant="h6">
                    {error}
                </Typography>
            </Container>
        )
    }
    return (
        <Container maxWidth="100vw" sx={{
            textAlign: "center", mt: 4
        }}>

            {session.payment_status === "paid" ? (
                <>
                    <Typography variant="h4">  thank you for purchasing</Typography> ,
                    <Box sx={{
                        mt: 22
                    }}>
                        <Typography variant="h6"> Session Id: {session_id}</Typography>
                        <Typography variant="body1">
                            we have received your payment. you will receive an email with other details soon
                        </Typography>
                    </Box>
                </>
            ) : (
                <>
                    <Typography variant="h4">  payment failed</Typography> ,
                    <Box sx={{
                        mt: 22
                    }}>
                        <Typography variant="body1">
                            your payment was unsuccessful                    </Typography>
                    </Box>
                </>
            )}
        </Container>
    )
}