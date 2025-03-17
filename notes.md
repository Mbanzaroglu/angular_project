/*
Goal: Build an Angular 16+ crew management app with multi-language support, using Angular Material and an in-memory data approach. 

Requirements:
1. Use Angular CLI and Angular Material.
2. Implement a Language Selector for English, French, and Portuguese (use i18n or ngx-translate).
3. Create a CrewList component with:
   - A table (MatTable) displaying: First Name, Last Name, Nationality, Title, Days On Board, Daily Rate, Currency, Total Income, and a Discount (optional) column.
   - An action menu with "Edit" (popup), "Delete", "Crew Card Page" navigation, and "Certificates" modal.
   - A summary of total income by currency at the bottom of the table.
4. Create a CrewCard component with two tabs:
   - 'Card' tab for crew details.
   - 'Certificates' tab for listing each certificate’s fields.
5. Add a popup to create a new Crew (with form fields and certificate addition).
6. Implement a CertificateType create page with a form (Name, Description).
7. Use Angular services (CrewService, CertificateService, TypeService) to handle in-memory data.
8. Organize code in modules (CrewModule, CertificateModule, SharedModule). 
9. Each new feature or fix should be a separate commit/push.

Implementation suggestions:
- Use Reactive Forms for adding/editing crew and certificate data.
- Validate required fields (e.g. First Name, Title, etc.).
- For multi-language, define translation keys for table headers, field labels, and messages.
- For the optional “Discount” column, recalculate Total Income in real time.

Now, let's start coding step by step:
1. Create the project structure.
2. Add the necessary modules, components, and services.
3. Set up routing for CrewList, CrewCard, CertificateType creation.
4. Integrate multi-language support.
5. Use Angular Material components (mat-table, mat-dialog, mat-tab, etc.).
6. Write each part in a clean, modular approach.
*/

// Start by scaffolding the Angular app with Material and a shared module for i18n/translation logic.
// Then proceed with the Crew module, creating the CrewList and CrewCard components, 
// followed by the Certificate module for managing certificates and their types.
