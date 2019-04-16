import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { registerUser } from '../../store/actions/authActions';
import TextGroupField from '../common/TextFieldGroup';

class Register extends Component {
	constructor() {
		super();
		this.state = {
			name: '',
			email: '',
			password: '',
			password2: '',
			errors: {}
		};
	}

	onChange = (e) => {
		this.setState({ [e.target.name]: e.target.value });
	};

	onSubmit = (e) => {
		e.preventDefault();
		const { name, email, password, password2 } = this.state;
		const newUser = { name, email, password, password2 };
		this.props.registerUser(newUser, this.props.history);
	};

	componentDidMount() {
		if (this.props.auth.isAuthenticated) {
			this.props.history.push('/dashboard');
		}
	}

	componentWillReceiveProps(nextProps) {
		const initialState = {
			name: '',
			email: '',
			password: '',
			password2: '',
			errors: {}
		};
		if (nextProps) {
			const noErr = Object.entries(nextProps.errors).length === 0 && nextProps.errors.constructor === Object;
			this.setState({ errors: nextProps.errors });
			if (noErr) this.setState(initialState);
		}
	}

	render() {
		const { name, email, password, password2, errors } = this.state;
		return (
			<div className="register">
				<div className="container">
					<div className="row">
						<div className="col-md-8 m-auto">
							<h1 className="display-4 text-center">Sign Up</h1>
							<p className="lead text-center">Create your DevConnector account</p>
							<form noValidate onSubmit={this.onSubmit}>
								<TextGroupField
									placeholder="Name"
									name="name"
									value={name}
									onChange={this.onChange}
									error={errors.name}
								/>
								<TextGroupField
									placeholder="Email Address"
									name="email"
									value={email}
									type="email"
									onChange={this.onChange}
									error={errors.email}
									info="This site uses Gravatar so if you want a profile image, use a Gravatar email"
								/>
								<TextGroupField
									type="password"
									placeholder="Password"
									name="password"
									value={password}
									onChange={this.onChange}
									error={errors.password}
								/>
								<TextGroupField
									type="password"
									placeholder="Confirm Password"
									name="password2"
									value={password2}
									onChange={this.onChange}
									error={errors.password2}
								/>
								<input type="submit" className="btn btn-info btn-block mt-4" />
							</form>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

Register.propTypes = {
	registerUser: PropTypes.func.isRequired,
	auth: PropTypes.object.isRequired,
	errors: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
	auth: state.auth,
	errors: state.errors
});

export default connect(mapStateToProps, { registerUser })(withRouter(Register));
