import * as Sentry from "@sentry/browser";
import { BrowserTracing } from "@sentry/tracing";

if(location.hostname == "ohkabots.ohkaspace.com"){
	Sentry.init({
		dsn: "https://2dcb38ea170f4e1aac11cd7140b39bdd@err.ohkaspace.com/1",
		integrations: [new BrowserTracing()],
		release: document.getElementById("version").getAttribute("content"),
		tracesSampleRate: 1.0,
	});
}