import * as Yup from 'yup';
import Plan from '../models/Plan';
import User from '../models/User';

class PlanController {

  async index(req, res){
    const plans = await Plan.findAll({
      attributes: ['id', 'title', 'duration', 'price'],
    });

    return res.json(plans);
  }
  async store(req, res){

    const schema = Yup.object().shape({
      title: Yup.string().required(),
      duration: Yup.number().required(),
      price: Yup.number().required()
    });

    if(!(await schema.isValid(req.body))){
      return res.status(400).json({error: 'Validation fails.'});
    }

    const user = await User.findOne({
      where: { 
        id: req.userId,
        provider: true,
      }
    });

    if(!user){
      return res.status(401).json({error: 'User is not a provider.'})
    }

    const { title, duration, price } = await Plan.create(req.body);
    return res.json({title, duration, price});
  }

  async update(req, res){

    const schema = Yup.object().shape({
      title: Yup.string(),
      duration: Yup.number(),
      price: Yup.number()
    });

    if(!(await schema.isValid(req.body))){
      return res.status(400).json({error: 'Validation fails.'});
    }

    const user = await User.findOne({
      where: { 
        id: req.userId,
        provider: true,
      }
    });

    if(!user){
      return res.status(401).json({error: 'User is not a provider.'})
    }

    const plan = await Plan.findByPk(req.params.id);

    if(plan == null){
      return res.status(400).json({error: 'Plan not found.'});
    }

    const { id, title, duration, price } = await plan.update(req.body);

    return res.json({ id, title, duration, price });
  }

  async delete(req, res){
    const user = await User.findOne({
      where: { 
        id: req.userId,
        provider: true,
      }
    });

    if(!user){
      return res.status(401).json({error: 'User is not a provider.'})
    }

    await Plan.destroy({
      where: {
        id: req.params.id,
      }
    });

    return res.json({destroyed: true});
  }
}

export default new PlanController();