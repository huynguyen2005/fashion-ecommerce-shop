const nodemailer = require("nodemailer");

const SMTP_SERVICE_PRESETS = {
  gmail: {
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
  },
};

const REQUIRED_MAIL_FIELDS = ["host", "user", "pass"];

const normalizeEnvValue = (value) => {
  if (typeof value !== "string") return value;

  const trimmedValue = value.trim();
  return trimmedValue.length > 0 ? trimmedValue : undefined;
};

const readSharedMailEnv = (...keys) => {
  for (const key of keys) {
    const value = normalizeEnvValue(process.env[key]);
    if (value !== undefined) return value;
  }

  return undefined;
};

const readMailEnv = (prefix, ...keys) => {
  for (const key of keys) {
    const value = normalizeEnvValue(process.env[`${prefix}_${key}`]);
    if (value !== undefined) return value;
  }

  return undefined;
};

const parseSecureValue = (value, fallback = false) => {
  if (typeof value === "boolean") return value;
  if (typeof value === "string") return value === "true";

  return fallback;
};

const createMailEnvConfig = (prefix) => ({
  service: readMailEnv(prefix, "MAIL_SERVICE") || readSharedMailEnv("SMTP_SERVICE"),
  host: readMailEnv(prefix, "MAIL_HOST") || readSharedMailEnv("SMTP_HOST"),
  port: readMailEnv(prefix, "MAIL_PORT") || readSharedMailEnv("SMTP_PORT"),
  secure: readMailEnv(prefix, "MAIL_SECURE") || readSharedMailEnv("SMTP_SECURE"),
  user: readMailEnv(prefix, "MAIL_USER") || readSharedMailEnv("SMTP_USER"),
  pass:
    readMailEnv(prefix, "MAIL_PASSWORD", "MAIL_PASS") ||
    readSharedMailEnv("SMTP_PASSWORD", "SMTP_PASS"),
  from:
    readMailEnv(prefix, "MAIL_FROM") ||
    readSharedMailEnv("SMTP_FROM_EMAIL", "SMTP_USER") ||
    readMailEnv(prefix, "MAIL_USER"),
});

const resolveMailConfig = (prefix) => {
  const envConfig = createMailEnvConfig(prefix);
  const servicePreset = SMTP_SERVICE_PRESETS[envConfig.service?.toLowerCase()] || {};

  return {
    host: envConfig.host || servicePreset.host,
    port: Number(envConfig.port) || servicePreset.port || 587,
    secure: parseSecureValue(envConfig.secure, servicePreset.secure || false),
    user: envConfig.user,
    pass: envConfig.pass,
    from: envConfig.from || envConfig.user,
  };
};

const env = process.env.NODE_ENV || "dev";
const mailConfigByEnv = {
  dev: resolveMailConfig("DEV"),
  pro: resolveMailConfig("PRO"),
};
const mailConfig = mailConfigByEnv[env] || mailConfigByEnv.dev;

let transporter;

const createMailTransporter = () => {
  if (transporter) return transporter;

  transporter = nodemailer.createTransport({
    host: mailConfig.host,
    port: mailConfig.port,
    secure: mailConfig.secure,
    auth: {
      user: mailConfig.user,
      pass: mailConfig.pass,
    },
  });

  return transporter;
};

module.exports = {
  mailConfig,
  createMailTransporter,
  requiredMailFields: REQUIRED_MAIL_FIELDS,
};
