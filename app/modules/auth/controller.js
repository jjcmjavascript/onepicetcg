const db = require('../../services/database');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');


class AuthController {

	saltRounds = 10;
	constructor() {
		this.dbUser= db.users;
	}

	async login(req, res) {
		const { email, password } = req.body;

		const userExistByEmail = await this.dbUser.findAll({
			where: {
				email: email
			}
		}).then( data => {
			const userFound= data[0];
			if (!userFound){
				return res
					.status(500)
					.json({errors: ['Error user not found'],})
			}
			
			if( !this.comparePassword(password, userFound.password)) {
				return res
				.status(401)
				.json({ message: "Email or password does not match!" });
			}
    
			const jwtToken = jwt.sign(
				{id: userFound.id , email: userFound.email },
				process.env.JWT_SECRET, {
					expiresIn: process.env.JWT_EXPIRES_IN
				},
			)
      

			return res.status(200).json({ token: jwtToken, });
		}).catch( err => {
			return res.status(500).json({
				errors: 'Oops!, something\'s wrong',
				message: err
			});
		});

	}

	async create(req, res) {
		const { email, name, password} = req.body;
		const passwordEncrypt = this.encriptPassword(password);
		const user = await this.dbUser.create({
			name,
			email,
			password: passwordEncrypt,
		}, { fields: ['name', 'email', 'password'] })
		.catch((err) => {
			console.log('Error', err);
			return res.status(500)
			.json({
				message: 'Oops! something\'s wrong',
				errors: `Error ${err}`}
			)
		});

		if(user){
			return res.status(201)
			.json({
				user,
				message: 'User Created Successfull'
			})
		}

	}

	async getAll(req, res) {
		const users = await this.dbUser.findAll()
		.catch( (err) => {
			return res.status(500)
			.json({
				message: 'Oops! something is wrong',
				errors: `Error ${err}`}
			)
		});

		return res.status(200)
		.json({
			users: users,
			message: 'OK',
			errors: ''
		})
	}

	encriptPassword(password) {
		return bcrypt.hashSync(password, this.saltRounds);
	}

	comparePassword(password, hash) {
		return bcrypt.compareSync(password, hash);
	}
}

module.exports = AuthController;
