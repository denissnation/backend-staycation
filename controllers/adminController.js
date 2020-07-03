const Activity = require('../model/Activity');
const Bank = require('../model/Bank');
const Booking = require('../model/Booking');
const Category = require('../model/Category');
const Feature = require('../model/Feature');
const Image = require('../model/Image');
const Item = require('../model/Item');
const Member = require('../model/Member');
const Users = require('../model/Users');
const bcrypt = require('bcrypt');
const fs = require('fs-extra');
const path = require('path');

module.exports = {
	viewSignin: async (req, res) => {
		try {
			const alertMessage = req.flash('alertMessage');
			const alertStatus = req.flash('alertStatus');
			const alert = { message: alertMessage, status: alertStatus };
			if (req.session.user == null || req.session.user == undefined) {
				res.render('index', {
					alert,
					title: 'Sign in | Staycation'
				});
			} else {
				res.redirect('/admin/dashboard');
			}
		} catch (error) {
			res.render('admin/category');
		}
	},

	actionSignin: async (req, res) => {
		const { username, password } = req.body;
		try {
			const user = await Users.findOne({ username: username });
			if (!user) {
				req.flash('alertMessage', 'Username Tidak terdaftar');
				req.flash('alertStatus', 'danger');
				res.redirect('/admin/signin');
			}
			const isPasswordMatch = await bcrypt.compare(password, user.password);
			if (!isPasswordMatch) {
				req.flash('alertMessage', 'Password Yang Anda Masukkan Salah');
				req.flash('alertStatus', 'danger');
				res.redirect('/admin/signin');
			}
			req.session.user = {
				id: user.id,
				username: user.username
			};
			res.redirect('/admin/dashboard');
		} catch (error) {
			res.redirect('/admin/signin');
		}
	},
	actionLogout: async (req, res) => {
		req.session.destroy();
		res.redirect('/admin/signin');
	},

	viewDashboard: async (req, res) => {
		const member = await Member.find();
		const item = await Item.find();
		const booking = await Booking.find();
		res.render('admin/dashboard/view_dashboard', {
			title: 'Dashboard | Staycation',
			user: req.session.user,
			member,
			item,
			booking
		});
	},
	viewCategory: async (req, res) => {
		try {
			const category = await Category.find();
			const alertMessage = req.flash('alertMessage');
			const alertStatus = req.flash('alertStatus');
			const alert = { message: alertMessage, status: alertStatus };

			res.render('admin/category/view_category', {
				category,
				alert,
				title: 'Category | Staycation',
				user: req.session.user
			});
		} catch (error) {
			res.render('admin/category');
		}
	},
	addCategory: async (req, res) => {
		try {
			const { name } = req.body;
			await Category.create({ name });
			req.flash('alertMessage', 'Add Category Success');
			req.flash('alertStatus', 'success');

			res.redirect('/admin/category');
		} catch (error) {
			req.flash('alertMessage', `${error.message}`);
			req.flash('alertStatus', 'danger');
			res.render('admin/category');
		}
	},
	editCategory: async (req, res) => {
		try {
			const { id, name } = req.body;
			const category = await Category.findOne({ _id: id });
			category.name = name;
			category.save();
			req.flash('alertMessage', 'Edit Category Success');
			req.flash('alertStatus', 'success');
			res.redirect('/admin/category');
		} catch (error) {
			req.flash('alertMessage', `${error.message}`);
			req.flash('alertStatus', 'danger');
			res.redirect('/admin/category');
		}
	},
	deleteCategory: async (req, res) => {
		try {
			const { id } = req.params;
			const category = await Category.findOne({ _id: id });
			await category.remove();
			req.flash('alertMessage', 'Delete Category Success');
			req.flash('alertStatus', 'success');
			res.redirect('/admin/category');
		} catch (error) {
			req.flash('alertMessage', `${error.message}`);
			req.flash('alertStatus', 'danger');
			res.redirect('/admin/category');
		}
	},

	viewBank: async (req, res) => {
		try {
			const bank = await Bank.find();
			const alertMessage = req.flash('alertMessage');
			const alertStatus = req.flash('alertStatus');
			const alert = { message: alertMessage, status: alertStatus };
			res.render('admin/bank/view_bank', {
				bank,
				title: 'Bank | Staycation',
				alert,
				user: req.session.user
			});
		} catch (error) {
			req.flash('alertMessage', `${error.message}`);
			req.flash('alertStatus', 'danger');
			res.redirect('/admin/bank');
		}
	},
	addBank: async (req, res) => {
		try {
			const { name, nameBank, nomorRekening } = req.body;
			await Bank.create({
				nameBank,
				nomorRekening,
				name,
				imageUrl: `images/${req.file.filename}`
			});
			req.flash('alertMessage', 'Add Bank Success');
			req.flash('alertStatus', 'success');
			res.redirect('/admin/bank');
		} catch (error) {
			req.flash('alertMessage', `${error.message}`);
			req.flash('alertStatus', 'danger');
			res.redirect('/admin/bank');
		}
	},

	editBank: async (req, res) => {
		try {
			const { id, name, nameBank, nomorRekening } = req.body;
			const bank = await Bank.findOne({ _id: id });
			if (req.file == undefined) {
				bank.name = name;
				bank.nameBank = nameBank;
				bank.nomorRekening = nomorRekening;
				await bank.save();
				req.flash('alertMessage', 'Edit Bank Success ');
				req.flash('alertStatus', 'success ');
				res.redirect('/admin/bank');
			} else {
				await fs.unlink(path.join(`public/${bank.imageUrl}`));
				bank.name = name;
				bank.nameBank = nameBank;
				bank.nomorRekening = nomorRekening;
				bank.imageUrl = `images/${req.file.filename}`;
				await bank.save();
				req.flash('alertMessage', 'Edit Bank Success');
				req.flash('alertStatus', 'success');
				res.redirect('/admin/bank');
			}
		} catch (error) {
			req.flash('alertMessage', `${error.message}`);
			req.flash('alertStatus', 'danger');
			res.redirect('/admin/bank');
		}
	},

	deleteBank: async (req, res) => {
		try {
			const { id } = req.params;
			const bank = await Bank.findOne({ _id: id });
			await fs.unlink(path.join(`public/${bank.imageUrl}`));
			await bank.remove();
			req.flash('alertMessage', 'Delete Bank Success');
			req.flash('alertStatus', 'success');
			res.redirect('/admin/bank');
		} catch (error) {
			req.flash('alertMessage', `${error.message}`);
			req.flash('alertStatus', 'danger');
			res.redirect('/admin/bank');
		}
	},
	viewItem: async (req, res) => {
		try {
			const item = await Item.find()
				.populate({ path: 'imageId', select: 'id imageUrl' })
				.populate({ path: 'categoryId', select: 'id name' });
			const category = await Category.find();
			let alertMessage = req.flash('alerMessage');
			let alertStatus = req.flash('alerStatus');
			let alert = { message: alertMessage, status: alertStatus };
			res.render('admin/item/view_item', {
				title: 'Item | Staycation',
				category,
				alert,
				item,
				action: 'view',
				user: req.session.user
			});
		} catch (error) {}
	},

	addItem: async (req, res) => {
		try {
			const { categoryId, price, title, city, desc } = req.body;
			if (req.files.length > 0) {
				const category = await Category.findOne({ _id: categoryId });
				const newItem = {
					categoryId,
					price,
					title,
					city,
					description: desc
				};

				const item = await Item.create(newItem);
				category.itemId.push({ _id: item._id });
				await category.save();

				for (let i = 0; i < req.files.length; i++) {
					const imageSave = await Image.create({ imageUrl: `images/${req.files[i].filename}` });
					item.imageId.push({ _id: imageSave._id });
					await item.save();
				}
				req.flash('alertMessage', 'Add Item Success');
				req.flash('alertStatus', 'success');
				res.redirect('/admin/item');
			}
		} catch (error) {
			req.flash('alertMessage', `${error.message}`);
			req.flash('alertStatus', 'danger');
			res.redirect('/admin/item');
		}
	},
	showImageItem: async (req, res) => {
		try {
			const { id } = req.params;
			const item = await Item.findOne({ _id: id }).populate({ path: 'imageId', select: 'id imageUrl' });
			const alertMessage = req.flash('alertMessage');
			const alertStatus = req.flash('alertStatus');
			const alert = { message: alertMessage, status: alertStatus };
			res.render('admin/item/view_item', {
				title: 'Staycation | Show Image Item',
				alert,
				item,
				action: 'show image',
				user: req.session.user
			});
		} catch (error) {
			req.flash('alertMessage', `${error.message}`);
			req.flash('alertStatus', 'danger');
			res.redirect('/admin/item');
		}
	},
	showEditItem: async (req, res) => {
		try {
			const { id } = req.params;
			const item = await Item.findOne({ _id: id })
				.populate({ path: 'imageId', select: 'id imageUrl' })
				.populate({ path: 'categoryId', select: 'id name' });
			const category = await Category.find();
			const alertMessage = req.flash('alertMessage');
			const alertStatus = req.flash('alertStatus');
			const alert = { message: alertMessage, status: alertStatus };
			res.render('admin/item/view_item', {
				title: 'Staycation | Show Image Item',
				alert,
				category,
				item,
				action: 'edit',
				user: req.session.user
			});
		} catch (error) {
			req.flash('alertMessage', `${error.message}`);
			req.flash('alertStatus', 'danger');
			res.redirect('/admin/item');
		}
	},
	editItem: async (req, res) => {
		try {
			const { id } = req.params;
			const { categoryId, price, title, city, desc } = req.body;
			const item = await Item.findOne({ _id: id })
				.populate({ path: 'imageId', select: 'id imageUrl' })
				.populate({ path: 'categoryId', select: 'id name' });
			if (req.files.length > 0) {
				for (let i = 0; i < item.imageId.length; i++) {
					const imageUpdate = await Image.findOne({ _id: item.imageId[i]._id });
					await fs.unlink(path.join(`public/${imageUpdate.imageUrl}`));
					imageUpdate.imageUrl = `images/${req.files[i].filename}`;
					await imageUpdate.save();
				}
				item.categoryId = categoryId;
				item.price = price;
				item.title = title;
				item.city = city;
				item.description = desc;
				await item.save();
				req.flash('alertMessage', 'Edit Item Success');
				req.flash('alertStatus', 'success');
				res.redirect('/admin/item');
			} else {
				item.categoryId = categoryId;
				item.price = price;
				item.title = title;
				item.city = city;
				item.description = desc;
				await item.save();
				req.flash('alertMessage', 'Edit Item Success');
				req.flash('alertStatus', 'success');
				res.redirect('/admin/item');
			}
		} catch (error) {
			req.flash('alertMessage', `${error.message}`);
			req.flash('alertStatus', 'danger');
			res.redirect('/admin/item');
		}
	},
	deleteItem: async (req, res) => {
		try {
			const { id } = req.params;
			const item = await Item.findOne({ _id: id }).populate('imageId');
			for (let i = 0; i < item.imageId.length; i++) {
				Image.findOne({ _id: item.imageId[i]._id })
					.then((image) => {
						fs.unlink(path.join(`public/${image.imageUrl}`));
						image.remove();
					})
					.catch((err) => {
						req.flash('alertMessage', `${error.message}`);
						req.flash('alertStatus', 'danger');
						res.redirect('/admin/item');
					});
			}
			await item.remove();
			req.flash('alertMessage', 'Delete Item Success');
			req.flash('alertStatus', 'success');
			res.redirect('/admin/item');
		} catch (error) {
			req.flash('alertMessage', `${error.message}`);
			req.flash('alertStatus', 'danger');
			res.redirect('/admin/item');
		}
	},
	viewDetailItem: async (req, res) => {
		const { itemId } = req.params;
		try {
			const alertMessage = req.flash('alertMessage');
			const alertStatus = req.flash('alertStatus');
			const alert = { message: alertMessage, status: alertStatus };
			const feature = await Feature.find({ itemId: itemId });
			const activity = await Activity.find({ itemId: itemId });
			res.render('admin/item/detail_item/view_detail_item', {
				title: 'Staycation | Detail Item',
				alert,
				itemId,
				feature,
				activity,
				user: req.session.user
			});
		} catch (error) {
			req.flash('alertMessage', `${error.message}`);
			req.flash('alertStatus', 'danger');
			res.redirect(`/admin/item/show-detail-item/${itemId}`);
		}
	},

	addFeature: async (req, res) => {
		try {
			const { itemId, name, qty } = req.body;
			if (!req.file) {
				req.flash('alertMessage', 'No file');
				req.flash('alertStatus', 'danger');
				res.redirect(`/admin/item/show_detail_item/${itemId}`);
			}

			const feature = await Feature.create({
				name,
				qty,
				itemId,
				imageUrl: `images/${req.file.filename}`
			});

			const item = await Item.findOne({ _id: itemId });
			item.featureId.push({ _id: feature._id });
			await item.save();
			req.flash('alertMessage', 'Add Feature Success');
			req.flash('alertStatus', 'success');
			res.redirect(`/admin/item/show_detail_item/${itemId}`);
		} catch (error) {
			req.flash('alertMessage', `${error.message}`);
			req.flash('alertStatus', 'danger');
			res.redirect(`/admin/item/show_detail_item/${itemId}`);
		}
	},

	editFeature: async (req, res) => {
		try {
			const { id, itemId, qty, name } = req.body;
			const feature = await Feature.findOne({ _id: id });
			if (req.file == undefined) {
				feature.qty = qty;
				feature.name = name;
				await feature.save();
				req.flash('alertMessage', 'Edit Feature Success');
				req.flash('alertStatus', 'success');
				res.redirect(`/admin/item/show_detail_item/${itemId}`);
			} else {
				await fs.unlink(path.join(`public/${feature.imageUrl}`));
				feature.qty = qty;
				feature.name = name;
				feature.imageUrl = `images/${req.file.filename}`;
				await feature.save();
				req.flash('alertMessage', 'Edit Feature Success');
				req.flash('alertStatus', 'success');
				res.redirect(`/admin/item/show_detail_item/${itemId}`);
			}
		} catch (error) {
			req.flash('alertMessage', `${error.message}`);
			req.flash('alertStatus', 'danger');
			res.redirect(`/admin/item/show-detail-item/${itemId}`);
		}
	},

	deleteFeature: async (req, res) => {
		const { id, itemId } = req.params;
		try {
			const feature = await Feature.findOne({ _id: id });
			const item = await Item.findOne({ _id: itemId }).populate('featureId');
			for (let i = 0; i < item.featureId.length; i++) {
				if (item.featureId[i]._id.toString() === feature._id.toString()) {
					item.featureId.pull({ _id: feature._id });
					await item.save();
				}
				fs.unlink(path.join(`public/${feature.imageUrl}`));
				await feature.remove();
				req.flash('alertMessage', 'Delete Feature Success');
				req.flash('alertStatus', 'success');
				res.redirect(`/admin/item/show_detail_item/${itemId}`);
			}
		} catch (error) {
			req.flash('alertMessage', `${error.message}`);
			req.flash('alertStatus', 'danger');
			res.redirect(`/admin/item/show_detail_item/${itemId}`);
		}
	},

	addActivity: async (req, res) => {
		try {
			const { itemId, name, type } = req.body;
			if (!req.file) {
				req.flash('alertMessage', 'No file');
				req.flash('alertStatus', 'danger');
				res.redirect(`/admin/item/show_detail_item/${itemId}`);
			}
			const activity = await Activity.create({
				name,
				type,
				itemId,
				imageUrl: `images/${req.file.filename}`
			});
			const item = await Item.findOne({ _id: itemId });

			item.activityId.push({ _id: activity._id });
			await item.save();

			req.flash('alertMessage', 'Add Activity Success');
			req.flash('alertStatus', 'success');
			res.redirect(`/admin/item/show_detail_item/${itemId}`);
		} catch (error) {
			req.flash('alertMessage', `${error.message}`);
			req.flash('alertStatus', 'danger');
			res.redirect(`/admin/item/show_detail_item/${itemId}`);
		}
	},
	editActivity: async (req, res) => {
		const { id, name, type, itemId } = req.body;
		try {
			const activity = await Activity.findOne({ _id: id });
			if (req.file == undefined) {
				activity.name = name;
				activity.type = type;
				await activity.save();
				req.flash('alertMessage', 'Edit Activity Success');
				req.flash('alertSuccess', 'success');
				res.redirect(`/admin/item/show_detail_item/${itemId}`);
			} else {
				await fs.unlink(path.join(`public/${activity.imageUrl}`));
				activity.imageUrl = `images/${req.file.filename}`;
				activity.name = name;
				activity.type = type;
				await activity.save();
				req.flash('alertMessage', 'Edit Activity Success');
				req.flash('alertStatus', 'success');
				res.redirect(`/admin/item/show_detail_item/${itemId}`);
			}
		} catch (error) {
			req.flash('alertMessage', `${error.message}`);
			req.flash('alertStatus', 'danger');
			res.redirect(`/admin/item/show_detail_item/${itemId}`);
		}
	},
	deleteActivity: async (req, res) => {
		const { id, itemId } = req.params;
		try {
			const activity = await Activity.findOne({ _id: id });
			const item = await Item.findOne({ _id: itemId }).populate('activityId');
			for (let i = 0; i < item.activityId.length; i++) {
				if (item.activityId[i]._id.toString() === activity._id.toString()) {
					item.activityId.pull({ _id: activity._id });
					await activity.save();
				}
				await fs.unlink(path.join(`public/${activity.imageUrl}`));
				await activity.remove();
				req.flash('alertMessage', 'Delete Activity Success');
				req.flash('alertStatus', 'success');
				res.redirect(`/admin/item/show_detail_item/${itemId}`);
			}
		} catch (error) {
			req.flash('alertMessage', `${error.message}`);
			req.flash('alertStatus', 'danger');
			res.redirect(`/admin/item/show_detail_item/${itemId}`);
		}
	},
	viewBooking: async (req, res) => {
		try {
			const booking = await Booking.find().populate('memberId').populate('bankId');
			res.render('admin/booking/view_booking', {
				title: 'Booking | Staycation',
				user: req.session.user,
				booking
			});
		} catch (error) {}
	},
	showDetailBooking: async (req, res) => {
		const { id } = req.params;
		try {
			const booking = await Booking.findOne({ _id: id }).populate('memberId').populate('bankId');
			res.render('admin/booking/view_detail_booking', {
				title: 'Booking | Staycation',
				user: req.session.user,
				booking
			});
		} catch (error) {}
	},
	actionConfirmation: async (req, res) => {
		const { id } = req.params;
		try {
			const booking = await Booking.findOne({ _id: id });
			booking.payments.status = 'Accept';
			await booking.save();
			req.flash('alertMessage', 'Booking Confirmation Success');
			req.flash('alertStatus', 'success');
			res.redirect(`/admin/booking/${id}`);
		} catch (error) {
			req.flash('alertMessage', `${error.message}`);
			req.flash('alertStatus', 'danger');
			res.redirect(`/admin/booking/${id}`);
		}
	},
	actionReject: async (req, res) => {
		const { id } = req.params;
		try {
			const booking = await Booking.findOne({ _id: id });
			booking.payments.status = 'Reject';
			await booking.save();
			req.flash('alertMessage', 'Booking Reject Success');
			req.flash('alertStatus', 'success');
			res.redirect(`/admin/booking/${id}`);
		} catch (error) {
			req.flash('alertMessage', `${error.message}`);
			req.flash('alertStatus', 'danger');
			res.redirect(`/admin/booking/${id}`);
		}
	}
};
