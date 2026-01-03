const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Company = sequelize.define('Company', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    companyName: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
        validate: {
            notEmpty: true,
            len: [2, 255]
        }
    },
    companyCode: {
        type: DataTypes.STRING(50),
        allowNull: true,
        unique: true
    },
    contactPerson: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    designation: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
            isEmail: true
        }
    },
    phone: {
        type: DataTypes.STRING(20),
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    alternatePhone: {
        type: DataTypes.STRING(20),
        allowNull: true
    },
    website: {
        type: DataTypes.STRING(255),
        allowNull: true,
        validate: {
            isUrl: true
        }
    },
    address: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    city: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    state: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    zipCode: {
        type: DataTypes.STRING(20),
        allowNull: true
    },
    industry: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    companySize: {
        type: DataTypes.STRING(50),
        allowNull: true
    },
    notes: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        allowNull: false
    }
}, {
    tableName: 'companies',
    timestamps: true,
    indexes: [
        {
            unique: true,
            fields: ['companyName']
        },
        {
            fields: ['email']
        },
        {
            fields: ['isActive']
        }
    ]
});

// Instance methods
Company.prototype.getFileCount = async function() {
    const File = require('./File');
    return await File.count({
        where: { companyId: this.id }
    });
};

// Class methods
Company.getActiveCompanies = async function() {
    return await this.findAll({
        where: { isActive: true },
        order: [['companyName', 'ASC']]
    });
};

// Hooks
Company.beforeCreate(async (company, options) => {
    // Auto-generate company code if not provided
    if (!company.companyCode) {
        const count = await Company.count();
        company.companyCode = `COMP-${String(count + 1).padStart(4, '0')}`;
    }
});

module.exports = Company;
