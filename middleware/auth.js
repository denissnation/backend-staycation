const isLogin = (req, res, next) => {
	if (req.session.user == null || req.session.user == undefined) {
		req.flash('alertMessage', 'Session Telah Habis Silahkan Signin Kembali');
		req.flash('alertStatus', 'danger');
		res.redirect('/admin/signin');
	} else {
		next();
	}
};

module.exports = isLogin;
