
const { Model, DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');

module.exports = (sequelize) => {
    class User extends Model { }
    User.init({
        firstName: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: {
                    msg: "A first name is required"
                },
                notEmpty: {
                    msg: "First name can not be empty"
                }
            }
        },
        lastName: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: {
                    msg: "A last name is required"
                },
                notEmpty: {
                    msg: "Last name can not be empty"
                }
            }
        },
        emailAddress: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: {
                    msg: "An email address is required"
                },
                notEmpty: {
                    msg: "Email address can not be empty"
                },
                isEmail: {
                    msg: "Invalid email address"
                }
            },
            unique: {
                msg: "Email already exist"
            }
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: {
                    msg: "A password is required"
                },
                notEmpty: {
                    msg: "Password can not be empty"
                },
            },
            set(val) {
                if (val) {
                    const hashedPassword = bcrypt.hashSync(val, 10);
                    this.setDataValue("password", hashedPassword);
                }
            }
        }
    }, { sequelize });

    User.associate = (models) => {
        User.hasMany(models.Course, {
            as: 'user',
            foreignKey: {
                fieldName: 'userId',
                allowNull: false,
            }
        })
    }

    return User;

};