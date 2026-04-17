const path = require("path");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();
const express = require("express");
const app = express();

app.use(cors());

app.use(express.json());

mongoose.connect(process.env.MONGO_URL);

const { Schema, model } = mongoose;

// Nome
const SiteConfigSchema = new Schema({
  siteName: String, // Nome usado em todo o site
  pageTitle: String, // Título da aba
  favicon: String,
});

// CONTROLE DE SEÇÕES
const SectionControlSchema = new Schema({
  testimonialsEnabled: {
    type: Boolean,
    default: true,
  },
});

// Hero
const HeroSchema = new Schema({
  images: [String],
  title: String,
  highlight: String,
  subtitle: String,
  description: String,
  buttonText: String,
});

// Sobre
const AboutSchema = new Schema({
  header: String, // título principal da seção
  cards: [
    {
      title: String,
      description: String,
      img: String,
      icon: String,
    },
  ],
});

// Depoimentos
const TestimonialSchema = new Schema({
  name: String,
  role: String,
  message: String,
  img: String,
});

const ServiceSectionSchema = new Schema({
  header: String, // "O que podemos fazer por você"
});

// Serviços
const ServiceSchema = new Schema({
  title: String,
  img: String,
});

// Contato/Footer
const FooterSchema = new Schema({
  address: String,
  phone: String,
  email: String,
  mapUrl: String,
  socials: [
    {
      name: String,
      url: String,
      enabled: {
        type: Boolean,
        default: true,
      },
    },
  ],
});

// Intro
const IntroSchema = new Schema({
  title: String,
  description: String,
  img: String,
  link: String,
});

// Instagram
const InstagramSchema = new Schema({
  permalink: String,
});

const SectionControl = model("SectionControl", SectionControlSchema);
const SiteConfig = model("SiteConfig", SiteConfigSchema);
const Testimonial = model("Testimonial", TestimonialSchema);
const Service = model("Service", ServiceSchema);
const ServiceSection = model("ServiceSection", ServiceSectionSchema);
const Footer = model("Footer", FooterSchema);
const Hero = model("Hero", HeroSchema);
const About = model("About", AboutSchema);
const Intro = model("Intro", IntroSchema);
const Instagram = model("Instagram", InstagramSchema);

// ROTAS

// CONTROLAR VISIBILIDADE DE SEÇÕES
app.get("/content/section-control", async (req, res) => {
  const control = await SectionControl.findOne();
  res.json(control || { testimonialsEnabled: true });
});

app.put("/content/section-control", async (req, res) => {
  const data = await SectionControl.findOneAndUpdate({}, req.body, {
    upsert: true,
    new: true,
  });
  res.json(data);
});

// NOME DO SITE
app.get("/content/site-config", async (req, res) => {
  const config = await SiteConfig.findOne();
  res.json(config || { siteName: "", pageTitle: "" });
});

app.put("/content/site-config", async (req, res) => {
  const data = await SiteConfig.findOneAndUpdate({}, req.body, {
    upsert: true,
    new: true,
  });
  res.json(data);
});

// HERO
app.get("/content/hero", async (req, res) => {
  const hero = await Hero.findOne();
  res.json(hero || { images: [] });
});

app.put("/content/hero", async (req, res) => {
  const data = await Hero.findOneAndUpdate({}, req.body, {
    upsert: true,
    new: true,
  });
  res.json(data);
});

// INTROS
app.get("/content/intros", async (req, res) => {
  const intros = await Intro.find();
  res.json(intros);
});
app.put("/content/intros", async (req, res) => {
  await Intro.deleteMany({});

  const normalized = req.body.map((i) => ({
    title: i.title || "",
    description: i.description || "",
    img: i.img || "",
    link: i.link || "",
  }));

  const newIntros = await Intro.insertMany(normalized);
  res.json(newIntros);
});

// INSTAGRAM
app.get("/content/instagram", async (req, res) => {
  const posts = await Instagram.find();
  res.json(posts);
});
app.put("/content/instagram", async (req, res) => {
  await Instagram.deleteMany({});
  const newPosts = await Instagram.insertMany(req.body);
  res.json(newPosts);
});

// SOBRE
app.get("/content/about", async (req, res) => {
  const about = await About.findOne();
  res.json(about || { title: "", description: "" });
});

app.put("/content/about", async (req, res) => {
  const normalized = {
    header: req.body.header || "",
    cards: (req.body.cards || []).map((c) => ({
      title: c.title || "",
      description: c.description || "",
      img: c.img || "",
      icon: c.icon || "",
    })),
  };

  const data = await About.findOneAndUpdate({}, normalized, {
    upsert: true,
    new: true,
  });

  res.json(data);
});

// SERVIÇOS
app.get("/content/services-section", async (req, res) => {
  const section = await ServiceSection.findOne();
  res.json(section || { header: "" });
});

app.put("/content/services-section", async (req, res) => {
  const data = await ServiceSection.findOneAndUpdate({}, req.body, {
    upsert: true,
    new: true,
  });
  res.json(data);
});

// DEPOMIMENTOS
app.get("/content/testimonials", async (req, res) => {
  const testimonials = await Testimonial.find();
  res.json(testimonials);
});

app.post("/content/testimonials", async (req, res) => {
  const newTestimonial = new Testimonial(req.body);
  await newTestimonial.save();
  res.json(newTestimonial);
});

app.put("/content/testimonials/:id", async (req, res) => {
  const updated = await Testimonial.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.json(updated);
});

app.delete("/content/testimonials/:id", async (req, res) => {
  await Testimonial.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

// SERVIÇOS
app.get("/content/services", async (req, res) => {
  const services = await Service.find();
  res.json(services);
});
app.put("/content/services", async (req, res) => {
  await Service.deleteMany({});

  const normalized = req.body.map((s) => ({
    title: s.title || "",
    img: s.img || "",
  }));

  const newServices = await Service.insertMany(normalized);
  res.json(newServices);
});

// CONTATO/FOOTER
app.get("/content/footer", async (req, res) => {
  const footer = await Footer.findOne();
  res.json(footer || { address: "", phone: "", email: "", socials: [] });
});
app.put("/content/footer", async (req, res) => {
  const data = await Footer.findOneAndUpdate({}, req.body, {
    upsert: true,
    new: true,
  });
  res.json(data);
});

app.use(express.static(path.join(__dirname, "public")));
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Porta para rodar o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
