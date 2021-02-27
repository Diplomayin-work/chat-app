// utils
import makeValidation from '@withvoid/make-validation'

import _ from 'lodash'


// models
import UserModel, {USER_TYPES} from '../models/User.js'
export default {
onGetAllUsers: async (req, res) => {
  try {
    const users = await UserModel.getUsers();
    return res.status(200).json({ success: true, users });
  } catch (error) {
    return res.status(500).json({ success: false, error: error })
  }
},



    onGetUserById: async (req, res) => {
      try {
        const user = await UserModel.getUserById(req.params.id)
        return res.status(200).json({success: true, user})
      } catch(error) {
        return res.status(500).json({ success:false, error: error})
      }
    },


    onCreateUser: async (req, res) => {


    //   try {
    //     const emailExists = await User.findOne({email:email})
    //     if (!emailExists) {
    //         res.status(400).json({error:"this email already exists"})
    //     }
    // } catch(error) {
    //     res.status(400).json({error:'Something went wrong'})
    // }

    let user = await UserModel.findOne({email: req.body.email});
    if (user) return res.status(400).json({Error:'User already registered'})



      try {
        const validation = makeValidation(types => ({
          payload: req.body,
          checks: {
            // firstName: { type: types.string },
            // lastName: { type: types.string },
            name: {type: types.string},
            email: {type: types.string},
            password:{type: types.string},
            type: { type: types.enum, options: { enum: USER_TYPES } },
          }
        }));

        if (!validation.success) return res.status(400).json(validation);

        const { name, email, password, type } = req.body;

        const user = await UserModel.createUser(name, email, password, type);
        return res.status(200).json({ success: true, user });

      } catch (error) {
        return res.status(500).json({ success: false, error: error })
      }
    },
    onDeleteUserById: async (req, res) => { },
  }
