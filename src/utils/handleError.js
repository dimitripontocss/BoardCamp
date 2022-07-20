function handleError({status, message, res}){
	return res.status(status).send(message);
}

export default handleError;