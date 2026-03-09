import React, { useState, useEffect } from "react";
import { Box, IconButton, Typography } from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";


import DnsSlideImage from "../assets/s1.jpg"
import IpamSlideImage from "../assets/s3.jpg"
import DhcpSlideImage from "../assets/s2.jpg"

const images = [DnsSlideImage, DhcpSlideImage, IpamSlideImage];

export default function Home() {
    const [index, setIndex] = useState(0);

    // const prev = () => {
    //     setIndex((index - 1 + images.length) % images.length);
    // };

    // const next = () => {
    //     setIndex((index + 1) % images.length);
    // };


    const next = () => {
        setIndex((prev) => (prev + 1) % images.length);
    };

    const prev = () => {
        setIndex((prev) =>
            prev === 0 ? images.length - 1 : prev - 1
        );
    };


    const [paused, setPaused] = useState(false);

    useEffect(() => {
        if (paused) return;

        const interval = setInterval(next, 3000);
        return () => clearInterval(interval);
    }, [paused]);

    return (
        <Box>
            {/* 1️⃣ Carousel */}
            <Box

                onMouseEnter={() => setPaused(true)}
                onMouseLeave={() => setPaused(false)}
                sx={{
                    position: "relative",
                    width: "100%",
                    height: 300,
                    borderRadius: 2,
                    overflow: "hidden",
                }}
            >
                <Box
                    component="img"
                    src={images[index]}
                    alt="carousel"
                    sx={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        filter: "blur(2px)",
                        transform: "scale(1.05)"
                    }}
                />

                <Box
                    sx={{
                        position: "absolute",
                        inset: 0,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        textAlign: "center",
                        color: "white",
                        backgroundColor: "rgba(0,0,0,0.4)", // optional overlay
                        px: 3,
                    }}
                >
                    {index === 0 && (
                        <>
                            <Typography variant="h3" component="h1" gutterBottom sx={{ fontFamily: "Algerian" }}>
                                DDI
                            </Typography>
                            <Typography variant="h5" component="h2" gutterBottom>
                                DNS - DOMAIN NAME SYSTEM
                            </Typography>
                            <Typography sx={{ maxWidth: 600 }} variant="body1">
                                Distributed directory service that maps names to the IP addresses needed by computers to connect to the resources being requested.
                            </Typography>
                        </>
                    )}

                    {index === 1 && (
                        <>

                            <Typography variant="h3" component="h1" gutterBottom sx={{ fontFamily: "Algerian" }}>
                                DDI
                            </Typography>
                            <Typography variant="h5" component="h3" gutterBottom>
                                DHCP - Dynamic Host Configuration Protocol
                            </Typography>
                            <Typography variant="body1" sx={{ maxWidth: 400 }}>
                                Service provides IP address to the computers to connect to the network.
                            </Typography>
                        </>
                    )}

                    {index === 2 && (
                        <>

                            <Typography variant="h3" component="h1" gutterBottom sx={{ fontFamily: "Algerian" }}>
                                DDI
                            </Typography>
                            <Typography variant="h5" component="h2" gutterBottom>
                                IPAM - IP Address Management
                            </Typography>
                            <Typography variant="body1" sx={{ maxWidth: 500 }}>
                                Central repository of IP Subnets for efficient planning, tracking & managing IP address space.
                            </Typography>
                        </>
                    )}
                </Box>

                <IconButton
                    onClick={prev}
                    sx={{ position: "absolute", top: "50%", left: 8, color: "white" }}
                >
                    <ArrowBackIosNewIcon />
                </IconButton>

                <IconButton
                    onClick={next}
                    sx={{ position: "absolute", top: "50%", right: 8, color: "white" }}
                >
                    <ArrowForwardIosIcon />
                </IconButton>
            </Box>

            {/* 2️⃣ First row of 4 small boxes */}
            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: "repeat(4, 1fr)",
                    gap: 2,
                    mt: 3, // margin-top to separate from carousel
                }}
            >
                {[1, 2, 3, 4].map((i) => (
                    <Box
                        key={i}
                        sx={{
                            height: 120,
                            borderRadius: 2,
                            backgroundColor: "#e0e0e0",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        Box {i}
                    </Box>
                ))}
            </Box>

            {/* 3️⃣ Second row of 4 small boxes */}
            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: "repeat(4, 1fr)",
                    gap: 2,
                    mt: 2,
                }}
            >
                {[5, 6, 7, 8].map((i) => (
                    <Box
                        key={i}
                        sx={{
                            height: 120,
                            borderRadius: 2,
                            backgroundColor: "#d6d6d6",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        Box {i}
                    </Box>
                ))}
            </Box>
        </Box>



    );
}

