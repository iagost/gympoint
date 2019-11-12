import Student from '../models/Student';
import auth from '../../config/auth';
import User from '../models/User';
import * as Yup from 'yup';

class StudentController {
  async store(req, res){

  const schema = Yup.object().shape({
    name: Yup.string().required(),
    email: Yup.string().email().required(),
    age: Yup.string().required(),
    height: Yup.string().required(),
    weight: Yup.string().required()
  })

  if(!(await schema.isValid(req.body))){
    return res.status(400).json({error: 'Validation fails.'});
  }

  const requestUser = await User.findOne({
    where: 
    {
      id: parseInt(auth.userIdLogged), 
      provider: true},
    });

    if(requestUser == null){
      return res.status(403).json({error: 'Forbbiden.'});
    }

    const {id, name, email} = await Student.create(req.body);

    return res.json({id, name, email});
  }

  async update(req, res){

    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email().required(),
      age: Yup.string(),
      height: Yup.string(),
      weight: Yup.string(),
    });

    if(!(await schema.isValid(req.body))){
      return res.status(400).json({error: 'Validation fails.'});
    }

    const student = await Student.findOne({where: {email: req.body.email}});

    if(student == null){
      return res.status(400).json({error: 'Student not found.'});
    }

    const {id, name, email} = await student.update(req.body);

    return res.json({id, name, email});
  }
}

export default new StudentController();