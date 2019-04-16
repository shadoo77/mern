import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

const InputGroup = (data) => {
	const { name, placeholder, value, error, icon, type, onChange } = data;
	return (
		<div className="input-group mp-3">
			<div className="input-group-prepend">
				<span className="input-group-text p-1">
					<i className={icon} style={{ width: 30 }} />
				</span>
			</div>
			<input
				className={classnames('form-control form-control-lg', {
					'is-invalid': error
				})}
				type={type}
				placeholder={placeholder}
				name={name}
				value={value}
				onChange={onChange}
			/>
			{error && <div className="invalid-feedback">{error}</div>}
		</div>
	);
};

InputGroup.propTypes = {
	name: PropTypes.string.isRequired,
	placeholder: PropTypes.string,
	value: PropTypes.string.isRequired,
	error: PropTypes.string,
	icon: PropTypes.string,
	type: PropTypes.string.isRequired,
	onChange: PropTypes.func.isRequired
};

InputGroup.defaultProps = {
	type: 'text'
};

export default InputGroup;
