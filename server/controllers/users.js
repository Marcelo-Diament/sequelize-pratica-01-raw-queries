const Sequelize = require('sequelize'),
  config = require('../config/database'),
  db = new Sequelize(config)

const usuariosPlaceholder = require('../data/usuariosPlaceholder.json')

const controller = {
  index: async (req, res, next) => {
    const users = await db.query('SELECT * FROM users', {
      type: Sequelize.QueryTypes.SELECT
    })
    res.render('users', {
      titulo: 'Usuários',
      subtitulo: 'Listagem de Usuários',
      usuarios: users,
      usuarioLogado: req.cookies.usuario,
      usuarioAdmin: req.cookies.admin,
      bannerTopo: '/images/banner-topo-usuarios-1564x472.png',
      bannerMeio: '/images/banner-meio-usuarios-1920x1080.png'
    });
  },
  show: (req, res, next) => {
    const { id } = req.params
    const usuario = usuariosPlaceholder[id - 1]
    res.render('user', {
      titulo: 'Usuário',
      subtitulo: `Usuário #${id}`,
      usuario,
      usuarioLogado: req.cookies.usuario,
      usuarioAdmin: req.cookies.admin,
      bannerTopo: '/images/banner-topo-usuario-1564x472.png',
      bannerMeio: '/images/banner-meio-usuario-1920x1080.png'
    });
  },
  list: async (req, res, next) => {
    const users = await db.query('SELECT * FROM users', {
      type: Sequelize.QueryTypes.SELECT
    })
    let admin = req.cookies.admin
    if (!admin || admin === 'false') {
      res.render('users', {
        titulo: 'Ops!',
        subtitulo: 'Você não pode gerenciar usuários, apenas visualizá-los.',
        usuarios: users,
        usuarioLogado: req.cookies.usuario,
        usuarioAdmin: admin,
        bannerTopo: '/images/banner-topo-usuarios-1564x472.png',
        bannerMeio: '/images/banner-meio-usuarios-1920x1080.png'
      });
    } else {
      res.render('usersList', {
        titulo: 'Usuários',
        subtitulo: 'Listagem de Usuários',
        usuarios: users,
        usuarioLogado: req.cookies.usuario,
        usuarioAdmin: admin
      });
    }
  }
}

module.exports = controller
