emailValidation = (email) => {
    let emailRe = /^([a-zA-Z.\-#0-9])+@[a-zA-Z]+.[a-z]{2,4}$/
    return !emailRe.test(email)
}

nameValidation = (name) => {
    let nameRe = /^\w{5,30}$/
    return !nameRe.test(name);
}


passValidation = (password) => {
    let passRe = /(?=^[a-zA-Z0-9!&#@]{4,16}$)(?=^.*[a-zA-Z]{1,})(?=^.*[0-9]{1,})/
    return !passRe.test(password)

}

const handleRegister =  (req, res, db, bcrypt) => {
    const { email, name, password } = req.body;
    if (!email || !name || !password) {
        return res.status(400).json("incorrect form submission")
    }
    
    if (emailValidation(email)) {
        return res.status(400).json("email invalid")
    } else if (nameValidation(name)) {
        return res.status(400).json("name invalid")
    } else if (passValidation(password)) {
        return res.status(400).json("password invalid")
    }
    
    const hash = bcrypt.hashSync(password);
        db.transaction(trx => {
            trx.insert({
                hash: hash,
                email: email
            })
            .into("login")
            .returning("email")
            .then(loginemail => {
                return trx("users")
                .returning("*")
                .insert({
                    email: loginemail[0],
                    name: name,
                    joined: new Date()
                })
                .then(user => {
                res.json(user[0]);
            })
        })
    .then(trx.commit)
    .catch(trx.rollback)
    })
    .catch(err => res.status(400).json("unable to register"))
        }

    module.exports = {
        handleRegister: handleRegister
    }