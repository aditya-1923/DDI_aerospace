import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import axios from "axios";

const IpamFaq = ({ isAdmin }) => {
  const [faqs, setFaqs] = useState([]);
  const [expanded, setExpanded] = useState([]);
  const [search, setSearch] = useState("");

  const [addOpen, setAddOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  /* ---------------- FETCH FAQS ---------------- */
  useEffect(() => {
    axios.get("/api/ipam/faq").then((res) => {
      setFaqs(res.data);
      setExpanded(res.data.map((f) => f.id));
    });
  }, []);

  /* ---------------- EXPAND / COLLAPSE ALL ---------------- */
  const toggleAll = () => {
    if (expanded.length) setExpanded([]);
    else setExpanded(faqs.map((f) => f.id));
  };

  /* ---------------- SEARCH ---------------- */
  const filteredFaqs = faqs.filter(
    (f) =>
      f.question.toLowerCase().includes(search.toLowerCase()) ||
      f.answer.toLowerCase().includes(search.toLowerCase())
  );

  /* ---------------- ADD FAQ ---------------- */
  const addFaq = async () => {
    await axios.post("/api/ipam/faq", { question, answer });
    setAddOpen(false);
    window.location.reload();
  };

  /* ---------------- DELETE FAQ ---------------- */
  const deleteFaq = async () => {
    await axios.delete(`/api/ipam/faq/${deleteId}`);
    setDeleteId(null);
    window.location.reload();
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* HEADER */}
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Button variant="outlined" onClick={toggleAll}>
          {expanded.length ? "Collapse All" : "Expand All"}
        </Button>

        {isAdmin && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setAddOpen(true)}
          >
            Insert FAQ
          </Button>
        )}
      </Box>

      {/* SEARCH */}
      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
        <TextField
          size="small"
          placeholder="Search FAQ"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </Box>

      {/* FAQ LIST */}
      {filteredFaqs.map((faq) => (
        <Accordion
          key={faq.id}
          expanded={expanded.includes(faq.id)}
          onChange={() =>
            setExpanded((prev) =>
              prev.includes(faq.id)
                ? prev.filter((id) => id !== faq.id)
                : [...prev, faq.id]
            )
          }
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography sx={{ flexGrow: 1 }}>{faq.question}</Typography>

            {isAdmin && (
              <IconButton
                color="error"
                onClick={(e) => {
                  e.stopPropagation();
                  setDeleteId(faq.id);
                }}
              >
                <DeleteIcon />
              </IconButton>
            )}
          </AccordionSummary>

          <AccordionDetails>
            <Typography sx={{ whiteSpace: "pre-line" }}>
              {faq.answer}
            </Typography>
          </AccordionDetails>
        </Accordion>
      ))}

      {/* ADD MODAL */}
      <Dialog open={addOpen} onClose={() => setAddOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add FAQ</DialogTitle>
        <DialogContent>
          <TextField
            label="Question"
            fullWidth
            multiline
            rows={2}
            sx={{ mb: 2 }}
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          />
          <TextField
            label="Answer"
            fullWidth
            multiline
            rows={6}
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            disabled={question.length < 5 || answer.length < 5}
            onClick={addFaq}
          >
            Proceed
          </Button>
        </DialogActions>
      </Dialog>

      {/* DELETE MODAL */}
      <Dialog open={Boolean(deleteId)} onClose={() => setDeleteId(null)}>
        <DialogTitle>Delete FAQ?</DialogTitle>
        <DialogActions>
          <Button onClick={() => setDeleteId(null)}>Cancel</Button>
          <Button variant="contained" color="error" onClick={deleteFaq}>
            Proceed
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default IpamFaq;
