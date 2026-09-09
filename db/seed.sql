-- Development only. Never apply this seed to production.
INSERT INTO categories (id,name,slug,created_at,updated_at) VALUES ('cat_development','Development','development',unixepoch(),unixepoch());
INSERT INTO courses (id,category_id,title,slug,description,level,language,price,currency,status,created_at,updated_at) VALUES ('course_portfolio','cat_development','Build Your First Professional Portfolio Website','professional-portfolio-website','Build and publish a professional personal portfolio website from scratch.','Beginner','English',1900,'USD','published',unixepoch(),unixepoch());
