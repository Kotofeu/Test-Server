class validationManagement {
    EMAIL_REGEXP = /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/iu;
    PASSWORD_REGEXP = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;
    isEmailValid(email) {
        if (!this.EMAIL_REGEXP.test(email) || !email){
            return false         
        }
        return true
    }

    isPasswordValid(password) {
        if(!this.PASSWORD_REGEXP.test(password) || !password)
            return false
        return true
    }
}

module.exports = new validationManagement(); 
