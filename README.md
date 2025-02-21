Features-
create app from template like Angular, React.
auto save feature while writing the code.
save your created projects in App (used AWS)
virtual terminal in UI, which runs command in backed server.
project output result can be shown in webpage
another code-editor features.

Technical aspects.
used Angular 17 for frontend app.
used Node.JS for backend server.
used AWS S3 bucket for projects data store.
created Express JS APis for CRUD operations and triggering events.
implemented Socket.IO for socket server which handle code editor update, delete, create events.
integrated Monaco code editor with angular.
used Angular RXJS libraries for asynchronous events.
used Redux for state management in Angular for code file updates.
created BullMQ service for realtime file update from UI to AWS bucket.
used Redis queue with BullMQ.