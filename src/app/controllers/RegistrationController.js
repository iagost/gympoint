import * as Yup from 'yup';
import { parseISO, addMonths, format } from 'date-fns';
import pt from 'date-fns/locale/pt';
import Registration from '../models/Registration';
import User from '../models/User';
import Plan from '../models/Plan';
import Student from '../models/Student';

import Mail from '../../lib/Mail';

class RegistrationController {

  async index(req, res){
    const provider = await User.findByPk(req.userId);

    if(!provider){
      return res.status(401).json({error: 'User is not a provider.'});
    }

    const registrations = await Registration.findAll();

    return res.json(registrations);
  }

  async store(req, res){

    const schema = Yup.object().shape({
      student_id: Yup.number().required(),
      plan_id: Yup.number().required(),
      start_date: Yup.date().required(),
    });

    if(!(await schema.isValid(req.body))){
      return res.status(400).json({error: 'Validation fails.'});
    }

    const provider = await User.findByPk(req.userId);

    if(!provider){
      return res.status(401).json({error: 'User is not a provider.'});
    }

    const { student_id, plan_id} = req.body;

    const student = await Student.findByPk(student_id)

    if(!student){
      return res.status(401).json({error: 'Student does not exists.'});
    }

    const existsRegistration = await Registration.findOne({ where: {student_id}})

    if(existsRegistration){
      return res.status(401).json({error: 'Registration for student already exists.'});
    }

    const plan = await Plan.findByPk(plan_id);

    if(!plan){
      return res.status(401).json({error: 'Plan does not exists.'});
    }

    const {duration, price, title} = plan;

    const start_date = parseISO(req.body.start_date);
    const end_date = addMonths(start_date, duration);

    const registration = await Registration.create({
      student_id,
      plan_id,
      start_date,
      end_date,
      price: price * duration,
    });

    await Mail.sendMail({
      to: `${student.name} <${student.email}>`,
      subject: 'Matrícula realizada',
      template: 'newRegistration',
      context: {
        student: student.name,
        plan: title,
        duration,
        start_date: format(start_date, "'dia' dd 'de' MMMM', às' H:mm'h'",
          {locale: pt}
        ),
        end_date: format(end_date, "'dia' dd 'de' MMMM', às' H:mm'h'",
          {locale: pt}
        ),
        price,
      }
    });
 
    return res.json(registration);
  }

  async update(req, res){

    const schema = Yup.object().shape({
      plan_id: Yup.number().required(),
      start_date: Yup.date().required(),
    });

    if(!(await schema.isValid(req.body))){
      return res.status(400).json({error: 'Validation fails.'});
    }

    const provider = await User.findByPk(req.userId);

    if(!provider){
      return res.status(401).json({error: 'User is not a provider.'});
    }

    const registration = await Registration.findByPk(req.params.id);

    if(!registration){
      return res.status(401).json({error: 'Registration does not exists.'});
    }

    const plan = await Plan.findByPk(req.body.plan_id);

    if(!plan){
      return res.status(401).json({error: 'Plan does not exists.'});
    }

    const {duration, price} = plan;

    const start_date = parseISO(req.body.start_date);
    const end_date = addMonths(start_date, duration);

    const {registrationUpdated} = await registration.update({
      plan_id: req.body.plan_id,
      start_date,
      end_date,
      price: price * duration,
    });

    return res.json(registrationUpdated);
  }

  async delete(req, res){
    const provider = await User.findByPk(req.userId);

    if(!provider){
      return res.status(401).json({error: 'User is not a provider.'});
    }

    const registration = await Registration.findByPk(req.params.id);

    if(!registration){
      return res.status(401).json({error: 'Registration does not exists.'});
    }

    await Registration.destroy({
      where: {
        id: req.params.id,
      }
    });

    return res.json({destroyed: true});
  }
}

export default new RegistrationController();