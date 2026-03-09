import React from "react";
import {
    Box,
    Card,
    CardContent,
    Typography,
    Alert,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    List,
    ListItem,
    ListItemText,
    Stack
} from "@mui/material";
import InfoIcon from '@mui/icons-material/Info';
import LightbulbIcon from '@mui/icons-material/Lightbulb';

const InstructionCard = () => {
    return (
        <Box>

            {/* Instructions Section */}
            <Card sx={{ mb: 1 }}>
                <CardContent sx={{ py: 1, "&:last-child": { pb: 1 } }}>

                    <Stack spacing={1}>
                        {/* Header */}
                        <Stack direction="row" spacing={1} alignItems="center">
                            <InfoIcon color="primary" />
                            <Typography variant="subtitle1" sx={{ m: 0 }}>
                                Instructions
                            </Typography>
                        </Stack>

                        <Alert severity="info" sx={{ fontSize: '0.8rem', mb: 2 }}>
                            <span style={{ color: 'red' }}>*</span> Dynamic DNS enabled domains are not managed in this portal. Kindly refer to FAQs for DDNS enabled domain request.
                        </Alert>

                        <Alert severity="info" sx={{ fontSize: '0.8rem', mb: 2 }}>
                            <span style={{ color: 'red' }}>*</span> Restricted DNS zones are not included in this Portal.

                            <Box sx={{ display: 'inline-flex', alignItems: 'center', ml: 0.5, flexWrap: 'wrap' }}>
                                <Typography variant="body2" sx={{ fontSize: '0.8rem', mr: 1 }}>
                                    Check Restricted Zones by selecting below:
                                </Typography>

                                <FormControl size="small" sx={{ minWidth: 200 }}>
                                    <InputLabel>Domain</InputLabel>
                                    <Select defaultValue="0" label="Domain">
                                        <MenuItem value="0">Select Domain</MenuItem>
                                        <MenuItem value="1">linux.cloud.geaerospace.net</MenuItem>
                                        <MenuItem value="2">devices.geaerospace.net</MenuItem>
                                        <MenuItem value="3">ddi.geaerospace.net</MenuItem>
                                    </Select>
                                </FormControl>
                            </Box>

                            <Typography variant="body2" sx={{ fontSize: '0.8rem', mt: 1 }}>
                                We do not allow addition of new record directly under restricted zone "geaerospace.net".
                            </Typography>

                            <Box
                                sx={{
                                    border: '1px solid #90caf9',
                                    borderRadius: 1,
                                    bgcolor: 'rgb(229, 246, 253)',
                                    p: 2,
                                    mt: 1
                                }}
                            >

                                <Typography
                                    sx={{
                                        fontSize: '0.8rem',
                                        display: 'flex',
                                        alignItems: 'flex-start',
                                        mb: 0.5, // 🔹 reduce space below Notes text
                                    }}
                                >
                                    <LightbulbIcon
                                        sx={{ color: 'orange', mr: 0.5, fontSize: '1rem', mt: '2px' }}
                                    />
                                    <span>
                                        <strong>Notes:</strong> All domains in the portal having dev/qa/stage as their
                                        subdomains should be set as preapproved for any kind of DNS request. All
                                        records under AD managed domain must work dynamically via TSIG updates or
                                        allow update ACL on each zone. Some dynamic domains are excluded from
                                        automation like devices.geaerospace.net / linux.cloud.geaerospace.net.
                                    </span>
                                </Typography>

                                {/* Bullet List */}
                                <List
                                    disablePadding
                                    sx={{
                                        listStyleType: 'disc',
                                        pl: 2,                 // 🔹 reduce left indent
                                        mt: 0,
                                        '& li::marker': {
                                            fontSize: '0.8rem',
                                        },
                                    }}
                                >
                                    <ListItem sx={{ display: 'list-item', py: 0 }}>
                                        <ListItemText
                                            primary={
                                                <>
                                                    Remote Desktop Protocol – <strong>devices.geaerospace.net</strong>
                                                </>
                                            }
                                            primaryTypographyProps={{ fontSize: '0.8rem', m: 0 }}
                                        />
                                    </ListItem>

                                    <ListItem sx={{ display: 'list-item', py: 0 }}>
                                        <ListItemText
                                            primary={
                                                <>
                                                    Dynamic DNS Zone for Linux – Application & Site Separation Migration –
                                                    Developer Cloud – <strong>linux.cloud.geaerospace.net</strong>
                                                </>
                                            }
                                            primaryTypographyProps={{ fontSize: '0.8rem', m: 0 }}
                                        />
                                    </ListItem>
                                </List>



                            </Box>

                        </Alert>

                    </Stack>
                </CardContent>
            </Card>
        </Box>
    );
};

export default InstructionCard;

