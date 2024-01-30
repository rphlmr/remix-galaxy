import { Link } from "@remix-run/react";

export default function Secure() {
	return (
		<div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
			<h1>Security zone</h1>
			<Link to="/auth/sign-out">Sign out</Link>
		</div>
	);
}
