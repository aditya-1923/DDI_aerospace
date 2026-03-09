// import { Card, CardContent, Typography } from "@mui/material";

// export default function PageHeader({ title }) {
//   return (
//     <Card sx={{ mb: 3, backgroundColor: "#00003d", color: "#fff" }}>
//       <CardContent>
//         <Typography variant="h6">{title}</Typography>
//       </CardContent>
//     </Card>
//   );
// }


import { Card, CardContent, Typography } from "@mui/material";

export default function PageHeader({ title, sx = {} }) {
  return (
    <Card
      sx={{
        backgroundColor: "#00003d",
        color: "#fff"
      }}
    >
      <CardContent
        sx={{
          py: 0.75,
          "&:last-child": { pb: 0.75 },
        }}
      >
        <Typography variant="h6" sx={{ m: 0 }}>
          {title}
        </Typography>
      </CardContent>
    </Card>
  );
}


