import { ERROR } from '@commons';

export default (req, res, next) => {
  // const {
  //   routeMap: { required = [], optional = [] },
  // } = req;
  // const routeProps = required.concat(optional);
  // const requestProps = { ...req.params, ...req.query, ...req.body };

  // req.props = {};
  // Object.keys(requestProps).forEach((key) => {
  //   if (routeProps.includes(key)) req.props[key] = requestProps[key];
  // });

  // if (required.length > 0) {
  //   const props = Object.keys(req.props);
  //   const requiredParameters = required.filter((x) => !props.includes(x));

  //   if (requiredParameters.length > 0) return ERROR.REQUIRED_PARAMETERS(res, requiredParameters.join(', '));
  // }

  req.props = { ...req.params, ...req.query, ...req.body };

  return next();
};
