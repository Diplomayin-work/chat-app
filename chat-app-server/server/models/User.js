import mongoose from 'mongoose';
import {v4 as uuidv4} from 'uuid'
import bcrypt from 'bcrypt'
import validator from 'validator'

export const USER_TYPES = {
    CONSUMER: "consumer",
    SUPPORT: 'support',
};

const userSchema = new mongoose.Schema(
    {
        _id: {
            type: String,
            default: () => uuidv4().replace(/\-/g, ""),


        },
        name: {
            type: String,
            required: true,
            trim: true
        },
        email: {
            type: String,
            unique: true,
            required: true,
            trim: true,
            lowercase: true,
            validate(value) {
                if (!validator.isEmail(value)) {
                    throw new Error('Email is Invalid')
                }
            }

        },
        password: {
            type: String,
            required: true,
            trim: true,
            minlength: 7,
            validate(value) {
                if (value.toLowerCase().includes('password')) {
                    throw new Error ('Password cannot contaon "password"')
                }
            }
        },
        // age: {
        //     type: Number,
        //     default: 0,
        //     validate(value) {
        //         if ( value < 0 || value < 13) {
        //             throw new Error('Age muste be a above 13')
        //         }
        //     }
        // },

        tokens: [{
            token: {
                type: String,
                required: true,
            }
        }],

        avatar: {
            type: Buffer
        },

        type: String
    },
        {
            timestamps: true,
            collection: "users",

        }
);


userSchema.statics.createUser = async function (
	      name,
    	  email,
          password,
          type
) {
  try {
    const user = await this.create({ name, email, password,  type });
    return user;
  } catch (error) {
    throw error;
  }
},

userSchema.statics.getUserById = async function (id){
    try {
        const user = await this.findOne({_id: id});
        if (!user) throw ({error: 'No user with this id found'});
        return user;
    } catch(error) {
        throw error;
    }
},

userSchema.statics.getUsers = async function () {
    try {
        const users = await this.find();
        return users;
    } catch(error) {
        throw error;
    }
}

userSchema.pre('save', async function (next) {

    const user = this

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }

    next()
})

export default mongoose.model("User", userSchema);
