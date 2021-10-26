const Sequelize = require('sequelize'),
  config = require('../config/database'),
  db = new Sequelize(config)

const fs = require('fs'),
  path = require('path')

const controller = {
  register: (req, res, next) => {
    res.render('register', {
      titulo: 'Cadastro',
      subtitulo: req.cookies.usuario ? 'Verifique o formulário e atualize os dados desejados.' : 'Preencha os dados e complete seu cadastro!',
      usuarioLogado: req.cookies.usuario,
      usuarioAdmin: req.cookies.admin
    });
  },
  add: async (req, res, next) => {
    const {
      nome,
      sobrenome,
      apelido,
      nascimento,
      senha,
      corPreferida,
      avatar,
      email,
      telefone,
      bio
    } = req.body
    const telefoneFormatted = telefone.replace(/\D/g, '')
    const plano_id = 1
    const papel_id = email.indexOf('@diament.com.br') > 0 ? 1 : 2
    const user = await db.query('INSERT INTO users (nome, sobrenome, apelido, nascimento, senha, corPreferida, avatar, email, telefone, bio) VALUES (:nome, :sobrenome, :apelido, :nascimento, :senha, :corPreferida, :avatar, :email, :telefoneFormatted, :bio)', {
      replacements: {
        nome,
        sobrenome,
        apelido,
        nascimento,
        senha,
        corPreferida,
        avatar,
        email,
        telefoneFormatted,
        bio,
        plano_id,
        papel_id
      },
      type: Sequelize.QueryTypes.INSERT
    })
    if (user) {
      res.redirect('../../usuarios')
    } else {
      res.status(500).send('Ops... Algo de errado não deu certo!')
    }
  },
  login: (req, res, next) => {
    res.render('login', {
      titulo: 'Login',
      subtitulo: 'Preencha os dados e acesse seu perfil!',
      usuarioLogado: req.cookies.usuario,
      usuarioAdmin: req.cookies.admin
    });
  },
  auth: (req, res, next) => {
    res.redirect('../')
  },
  lostPass: (req, res, next) => {
    res.render('lostPassword', {
      titulo: 'Recuperação de Senha',
      subtitulo: 'Preencha os dados e recupere sua senha!',
      usuarioLogado: req.cookies.usuario,
      usuarioAdmin: req.cookies.admin
    });
  },
  update: (req, res, next) => {
    const idBuscado = req.params.id.replace('/', '')
    const usuariosOld = fs.readFileSync(path.join(__dirname, '..', 'data', 'usuariosPlaceholder.json'), 'utf-8')
    let usuarios = JSON.parse(usuariosOld)
    let usuario = usuarios.filter(usuario => usuario.id == idBuscado)[0]
    res.render('userUpdate', {
      titulo: 'Cadastro',
      subtitulo: req.cookies.usuario ? `Verifique os dados e atualize os que precisar` : 'Preencha os dados e complete seu cadastro!',
      usuarioLogado: req.cookies.usuario,
      usuarioAdmin: req.cookies.admin,
      usuarioEditando: usuario
    })
  },
  edit: (req, res, next) => {
    const idBuscado = req.params.id.replace('/', '')
    const usuariosOld = fs.readFileSync(path.join(__dirname, '..', 'data', 'usuariosPlaceholder.json'), 'utf-8')
    let usuarios = JSON.parse(usuariosOld)
    let usuario = usuarios.filter(usuario => usuario.id == idBuscado)[0]

    let usuarioAtualizado = req.body
    for (let prop in usuarioAtualizado) {
      if (usuarioAtualizado[prop] !== "") {
        usuario[prop] = usuarioAtualizado[prop]
      }
    }
    usuario.modificadoEm = new Date()

    usuarios.forEach(usuarioFinal => {
      if (usuarioFinal.id == usuario.id) {
        usuarioFinal = usuario
        usuarioFinal.id = parseInt(usuario.id)
      }
    })

    fs.writeFileSync(path.join(__dirname, '..', 'data', 'usuariosPlaceholder.json'), JSON.stringify(usuarios))

    if (req.cookies.usuario.id === usuario.id) {
      res.clearCookie('usuario').cookie('usuario', usuario)
    }
    res.render('user', {
      titulo: 'Usuário',
      subtitulo: `Usuário #${idBuscado}`,
      usuario,
      usuarioLogado: req.cookies.usuario,
      usuarioAdmin: req.cookies.admin,
      bannerTopo: '/images/banner-topo-usuario-1564x472.png',
      bannerMeio: '/images/banner-meio-usuario-1920x1080.png'
    })
  },
  delete: (req, res, next) => {
    const idBuscado = req.params.id.replace('/', '')
    const usuariosOld = fs.readFileSync(path.join(__dirname, '..', 'data', 'usuariosPlaceholder.json'), 'utf-8')
    let usuariosNew = JSON.parse(usuariosOld)
    usuariosNew = usuariosNew.filter(usuario => usuario.id != idBuscado)
    fs.writeFileSync(path.join(__dirname, '..', 'data', 'usuariosPlaceholder.json'), JSON.stringify(usuariosNew))
    res.render('usersList', {
      titulo: 'Usuários',
      subtitulo: 'Listagem de Usuários',
      usuarios: usuariosNew,
      usuarioLogado: req.cookies.usuario,
      usuarioAdmin: req.cookies.admin
    })
  },
  logout: (req, res, next) => {
    res.clearCookie('usuario').clearCookie('admin').redirect('../../')
  }
}

module.exports = controller
