import React, { useState } from "react";
import {
    Box,
    Button,
    Card,
    CardContent,
    CardHeader,
    Checkbox,
    FormControl,
    FormHelperText,
    InputLabel,
    MenuItem,
    Select,
    TextField,
    Typography,
    Grid,
    Alert,
} from "@mui/material";

const FeedbackCard = () => {

    const [actionType, setActionType] = useState("select");

    const [subject, setSubject] = useState("");
    const [customSubject, setCustomSubject] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [responseMsg, setResponseMsg] = useState("");
    const [checkBox, setCheckBox] = useState(false);
    const labelStyle = {
        textAlign: "left",
        pr: 1,
        fontWeight: 500,
    };
    return (
        <Box component="section" sx={{ width: "100%" }}>
            <Card>
                <CardContent>
                    <Grid container spacing={2}>

                        {/* LEFT COLUMN */}
                        <Grid size={{ xs: 12, md: 6 }}>

                            <Grid container spacing={2} alignItems="center" sx={{ mb: 1 }}>
                                <Grid size={labelStyle}>
                                    <Typography sx={labelStyle}>
                                        Please let us know your queries or feedback.
                                    </Typography>
                                </Grid>
                            </Grid>

                            {/* Row 1: Select Request */}
                            <Grid container spacing={2} alignItems="center" sx={{ mb: 1 }}>

                                <Grid size={4}>
                                    <Typography sx={labelStyle}>Subject</Typography>
                                </Grid>
                                <Grid size={8}>
                                    <FormControl fullWidth size="small">
                                        <Select
                                            value={actionType}
                                            onChange={(e) => setActionType(e.target.value)}
                                        >
                                            <MenuItem value="select">Select</MenuItem>
                                            <MenuItem value="IPAM Question">IPAM Question</MenuItem>
                                            <MenuItem value="Webpage Error">Webpage Error</MenuItem>
                                            <MenuItem value="Customer Feedback">Customer Feedback</MenuItem>
                                            <MenuItem value="Subnet not showing">Subnet not showing</MenuItem>
                                            <MenuItem value="Information Required">Information Required</MenuItem>
                                            <MenuItem value="Modify Subnet Details">
                                                Modify Subnet Details
                                            </MenuItem>
                                            <MenuItem value="Others">Others</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                            </Grid>

                            <Grid container spacing={2} alignItems="left" sx={{ mb: 1 }}>

                                <Grid size={4}>
                                    <Typography sx={labelStyle}>Message</Typography>
                                </Grid>
                                <Grid size={8}>
                                    {subject === "Others" && (
                                        <TextField
                                            label="Enter Subject"
                                            value={customSubject}
                                            onChange={(e) => setCustomSubject(e.target.value)}
                                            fullWidth
                                            required
                                            sx={{ mb: 2 }}
                                        />
                                    )}

                                    <TextField
                                        label="Message"
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        multiline
                                        rows={8}
                                        fullWidth
                                        required
                                        sx={{ mb: 2 }}
                                    />
                                </Grid>

                            </Grid>

                            <Grid container spacing={2} alignItems="center" sx={{ mb: 1 }}>

                                <Box sx={{ display: "flex", gap: 2, mt:3 }}>
                                    <Button
                                        type="reset"
                                        variant="outlined"
                                        onClick={() => {
                                            setSubject("");
                                            setCustomSubject("");
                                            setMessage("");
                                        }}
                                    >
                                        Reset
                                    </Button>

                                    <Button type="submit" variant="contained" disabled={loading}>
                                        {loading ? "Sending..." : "Submit"}
                                    </Button>
                                </Box>
                            </Grid>


                        </Grid>

                        <Grid size={{ xs: 12, md: 6 }}>

                            <Typography variant="h6" gutterBottom>
                                <i className="fas fa-envelope" /> Contact us
                            </Typography>
                            <Box sx={{ mb: 2 }}>
                                <Alert severity="info">
                                    <Typography variant="subtitle1">DDI Aerospace Team</Typography>
                                    <a href="mailto:aer@gail.com">aero@geaerospace.com</a>
                                </Alert>
                                <Alert severity="info">
                                    <Typography variant="subtitle1">DDI Aerospace Application</Typography>
                                    <a href="mailto:abc@gmail.com">Aero@geaerospace.com</a>
                                </Alert>
                            </Box>

                        </Grid>
                    </Grid>
                </CardContent>
            </Card>


        </Box >
    );
};

export default FeedbackCard;


// import React, { useState } from "react";
// import {
//     Box,
//     Button,
//     Card,
//     CardContent,
//     Typography,
//     Grid,
//     FormControl,
//     MenuItem,
//     Select,
//     TextField,
//     Alert,
// } from "@mui/material";

// const FeedbackCard = () => {
//     const [subject, setSubject] = useState("select");
//     const [customSubject, setCustomSubject] = useState("");
//     const [message, setMessage] = useState("");
//     const [loading, setLoading] = useState(false);
//     const [responseMsg, setResponseMsg] = useState("");
//     const [errorMsg, setErrorMsg] = useState("");


//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setResponseMsg("");
//         setErrorMsg("");

//         // Avoid submission if subject not selected or message empty
//         if ((subject === "select") || (subject === "Others" && !customSubject.trim()) || !message.trim()) {
//             setErrorMsg("Please fill all required fields.");
//             return;
//         }

//         setLoading(true);
//         const data = {
//             subject: subject === "Others" ? customSubject : subject,
//             message: message,
//         };

//         try {
//             // const res = await axios.post("/ipam_support", data); // With proxy in package.json, no need for full URL
//             const res = ""
//             setResponseMsg(res.data || "Message sent successfully!");
//             setSubject("select");
//             setCustomSubject("");
//             setMessage("");
//         } catch (err) {
//             console.error(err);
//             setErrorMsg("Failed to send message. Please try again.");
//         } finally {
//             setLoading(false);
//         }
//     };

//     const labelStyle = { textAlign: "left", pr: 1, fontWeight: 500 };

//     return (
//         <Box component="section" sx={{ width: "100%" }}>
//             <Card>
//                 <CardContent>
//                     <form onSubmit={handleSubmit}>
//                         <Grid container spacing={4}>

//                             {/* LEFT COLUMN */}
//                             <Grid size={{ xs: 12, md: 6 }}>
//                                 <Grid container spacing={2} alignItems="center" sx={{ mb: 1 }}>

//                                     <Grid size={labelStyle}>
//                                         <Typography sx={labelStyle}>
//                                             Please let us know your queries or feedback.
//                                         </Typography>
//                                     </Grid>

//                                     {errorMsg && <Alert severity="error" sx={{ mb: 2 }}>{errorMsg}</Alert>}
//                                     {responseMsg && <Alert severity="success" sx={{ mb: 2 }}>{responseMsg}</Alert>}

//                                     <Grid container spacing={2} alignItems="center" sx={{ mb: 1 }}>

//                                         <Grid size={4}>
//                                             <Typography sx={labelStyle}>Subject</Typography>
//                                         </Grid>
//                                         <Grid size={8}>
//                                             <FormControl fullWidth size="small">
//                                                 {/* <Typography sx={labelStyle}>Subject</Typography> */}

//                                                 <Select
//                                                     value={subject}
//                                                     onChange={(e) => setSubject(e.target.value)}
//                                                 >
//                                                     <MenuItem value="select">Select</MenuItem>
//                                                     <MenuItem value="About Existing Request">About Existing Request</MenuItem>
//                                                     <MenuItem value="IPAM Question">IPAM Question</MenuItem>
//                                                     <MenuItem value="Webpage Error">Webpage Error</MenuItem>
//                                                     <MenuItem value="Customer Feedback">Customer Feedback</MenuItem>
//                                                     <MenuItem value="Subnet not showing">Subnet not showing</MenuItem>
//                                                     <MenuItem value="Information Required">Information Required</MenuItem>
//                                                     <MenuItem value="Modify Subnet Details">Modify Subnet Details</MenuItem>
//                                                     <MenuItem value="Others">Others</MenuItem>
//                                                 </Select>
//                                             </FormControl>
//                                         </Grid>

//                                     </Grid>

//                                     {/* Custom subject for "Others" */}
//                                     {subject === "Others" && (
//                                         <TextField
//                                             label="Enter Subject"
//                                             value={customSubject}
//                                             onChange={(e) => setCustomSubject(e.target.value)}
//                                             fullWidth
//                                             required
//                                             sx={{ mb: 2 }}
//                                         />
//                                     )}

//                                     {/* Message */}
//                                     <TextField
//                                         label="Message"
//                                         value={message}
//                                         onChange={(e) => setMessage(e.target.value)}
//                                         multiline
//                                         rows={8}
//                                         fullWidth
//                                         required
//                                         sx={{ mb: 2 }}
//                                     />

//                                     {/* Buttons */}
//                                     <Box sx={{ display: "flex", justifyContent: "space-between" }}>
//                                         <Button
//                                             type="button"
//                                             variant="outlined"
//                                             onClick={() => {
//                                                 setSubject("select");
//                                                 setCustomSubject("");
//                                                 setMessage("");
//                                                 setResponseMsg("");
//                                                 setErrorMsg("");
//                                             }}
//                                         >
//                                             Reset
//                                         </Button>
//                                         <Button type="submit" variant="contained" disabled={loading}>
//                                             {loading ? "Sending..." : "Submit"}
//                                         </Button>
//                                     </Box>
//                                 </Grid>
//                             </Grid>

//                             {/* RIGHT COLUMN */}
//                             <Grid item xs={12} md={6}>
//                                 <Typography variant="h6" gutterBottom>
//                                     <i className="fas fa-envelope" /> Contact us
//                                 </Typography>
//                                 <Box sx={{ mb: 2 }}>
//                                     <Alert severity="info">
//                                         <Typography variant="subtitle1">DDI Aerospace Team</Typography>
//                                         <a href="mailto:aer@gail.com">aero@geaerospace.com</a>
//                                     </Alert>
//                                     <Alert severity="info">
//                                         <Typography variant="subtitle1">DDI Aerospace Application</Typography>
//                                         <a href="mailto:abc@gmail.com">Aero@geaerospace.com</a>
//                                     </Alert>
//                                 </Box>
//                             </Grid>

//                         </Grid>
//                     </form>
//                 </CardContent>
//             </Card>
//         </Box>
//     );
// };

// export default FeedbackCard;
