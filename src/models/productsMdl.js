import db from '../config/db.js';

async function GetAllProducts() {
    const q = `SELECT produit.id AS produit_id,
                nom_produit,
                produit.description AS produit_description,
                produit.prix AS produit_prix,
                produit.actif AS produit_state,
                produit.is_new_drop,
                categorie.id AS categorie_id,
                categorie.nom AS categorie_nom,
                variante_produit.id AS variante_id,
                variante_produit.taille AS variante_taille,
                variante_produit.couleur AS variante_couleur,
                image_produit.id AS image_id,
                image_produit.url AS image_url
                FROM produit
                INNER JOIN categorie ON produit.id_categorie = categorie.id
                INNER JOIN variante_produit ON variante_produit.id_produit = produit.id
                INNER JOIN image_produit ON image_produit.id_variante = variante_produit.id
                GROUP BY produit.id;`
    return new Promise(async (resolve, reject) => {
        await db.query(q, [], (err, result) => {
            if (err) return reject(err)
            return resolve(result);
        });
    });
};

async function GetwithGender(gender) {
    const q = `SELECT produit.id AS produit_id,
                nom_produit,
                produit.description AS produit_description,
                produit.prix AS produit_prix,
		        produit.actif AS produit_state,
		        produit.is_new_drop,

                categorie.id AS categorie_id,
                categorie.nom AS categorie_nom,

                variante_produit.id AS variante_id,
                variante_produit.taille AS variante_taille,
                variante_produit.couleur AS variante_couleur,

                image_produit.id AS image_id,
                image_produit.url AS image_url

                FROM produit
                INNER JOIN categorie ON produit.id_categorie = categorie.id
                INNER JOIN variante_produit ON variante_produit.id_produit = produit.id
                INNER JOIN image_produit ON image_produit.id_variante = variante_produit.id
                WHERE categorie.nom = ?
                GROUP BY produit.id`;
    return new Promise(async (resolve, reject) => {
        await db.query(q, [gender], (err, result) => {
            if (err) return reject(err);
            return resolve(result);
        });
    });
}


async function GetNewProducts() {
    const q = `SELECT produit.id AS produit_id,
                nom_produit,
                produit.description AS produit_description,
                produit.prix AS produit_prix,
		        produit.actif AS produit_state,
		        produit.is_new_drop,

                categorie.id AS categorie_id,
                categorie.nom AS categorie_nom,

                variante_produit.id AS variante_id,
                variante_produit.taille AS variante_taille,
                variante_produit.couleur AS variante_couleur,

                image_produit.id AS image_id,
                image_produit.url AS image_url

                FROM produit
                INNER JOIN categorie ON produit.id_categorie = categorie.id
                INNER JOIN variante_produit ON variante_produit.id_produit = produit.id
                INNER JOIN image_produit ON image_produit.id_variante = variante_produit.id
                WHERE produit.is_new_drop = ?
                GROUP BY produit.id`;
    return new Promise(async (resolve, reject) => {
        await db.query(q, [1], (err, result) => {
            if (err) return reject(err);
            return resolve(result);
        })
    })
}

async function GetProductById(id) {
    const q = `SELECT produit.id AS produit_id,
                nom_produit,
                produit.description AS produit_description,
                produit.prix AS produit_prix,
		        produit.actif AS produit_state,
		        produit.is_new_drop,

                categorie.id AS categorie_id,
                categorie.nom AS categorie_nom,

                variante_produit.id AS variante_id,
                variante_produit.taille AS variante_taille,
                variante_produit.couleur AS variante_couleur,

                image_produit.id AS image_id,
                image_produit.url AS image_url

                FROM produit
                INNER JOIN categorie ON produit.id_categorie = categorie.id
                INNER JOIN variante_produit ON variante_produit.id_produit = produit.id
                INNER JOIN image_produit ON image_produit.id_variante = variante_produit.id
                WHERE produit.id = ?`;
    return new Promise(async (resolve, reject) => {
        await db.query(q, [id], (err, result) => {
            if (err) return reject(err);

            return resolve(result);
        })
    })
}

export default { GetAllProducts, GetwithGender, GetNewProducts, GetProductById }