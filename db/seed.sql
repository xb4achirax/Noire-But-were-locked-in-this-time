-- ============================================
-- noire seed.sql
-- Run in order: parents before children (FK constraints)
-- ============================================
use noire;
-- Clear existing data (dev only, respects FK order)
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE image_produit;
TRUNCATE TABLE variante_produit;
TRUNCATE TABLE produit;
TRUNCATE TABLE categorie;
SET FOREIGN_KEY_CHECKS = 1;

-- ============================================
-- 1. CATEGORIE (parents first, then children)
-- ============================================

INSERT INTO categorie(id, nom , id_categorie_parent) VALUES 
    (1, 'male', null),
    (2, 'women', null),
    (3, 'accessories', null),
    (4, 'shoes', null),
    (5, 'women tops', 2),
    (6, 'women bottoms', 2),
    (7, 'men tops', 1),
    (8, 'men bottoms', 1);

INSERT INTO produit(nom_produit, description, prix, marque, date_ajout, actif, id_categorie, is_new_drop) VALUES 
    ('Oversized Tee', 'Heavyweight cotton oversized tee', 45.00, 'noire', NOW(), 1, 1, 1),
    ('Boxy Hoodie', 'Boxy fit fleece hoodie', 85.00, 'noire', NOW(), 1, 1, 1),
    ('Slip Dress', 'Satin slip dress', 65.00, 'noire', NOW(), 1, 2, 0);

INSERT INTO variante_produit(taille, couleur, sku, prix_supplement, id_produit) VALUES
    ('S', 'Black', 'OT-BLK-S', 0, 1),
    ('M', 'Black', 'OT-BLK-M', 0, 1),
    ('L', 'Red', 'OT-BLK-L', 0, 1),
    ('M', 'White', 'OT-WHT-M', 0, 1),
    ('M', 'Black', 'BH-BLK-M', 0, 2),
    ('L', 'Black', 'BH-BLK-L', 0, 2),
    ('S', 'Red', 'SD-RED-S', 0, 3),
    ('M', 'Red', 'SD-RED-M', 0, 3);

INSERT INTO image_produit(url, ordre, id_variante) VALUES
    ('/images/product-leggings.png', 2, 2),
    ('/images/product-hoodie.png', 1, 3),
    ('/images/product-joggers.png', 1, 5),
    ('/images/product-tank.png', 1, 7);