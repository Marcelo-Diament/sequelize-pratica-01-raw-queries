const Sequelize = require('sequelize'),
  config = require('../config/database'),
  db = new Sequelize(config)

const usuariosPlaceholder = require('../data/usuariosPlaceholder.json')
const produtosPlaceholder = require('../data/produtosPlaceholder.json')

const controller = {
  index: async (req, res, next) => {
    const users = await db.query('SELECT * FROM users', {
      type: Sequelize.QueryTypes.SELECT
    })
    res.render('index', {
      titulo: 'Jeff Co.',
      subtitulo: 'Confira nossos Produtos e Usuários',
      usuarios: users,
      produtos: produtosPlaceholder,
      usuarioLogado: req.cookies.usuario,
      usuarioAdmin: req.cookies.admin,
      bannerTopo: '/images/banner-topo-index-1564x472.png',
      bannerMeio: '/images/banner-meio-index-1920x1080.png'
    });
  }
}

module.exports = controller
