export const course = {
  id:'course_portfolio', slug:'professional-portfolio-website', title:'Build Your First Professional Portfolio Website', category:'Development', level:'Beginner', instructor:'Claremint', price:1900, currency:'USD', language:'English', duration:'3 hours 20 minutes',
  description:'Build and publish a professional personal portfolio website from scratch. Learn how to structure your content, create a clean responsive layout, showcase projects properly, deploy the site, and connect your own domain.',
  outcomes:['Plan a useful portfolio','Structure HTML correctly','Build responsive layouts','Style a professional interface','Create project cards','Add a contact section','Make the website mobile friendly','Deploy the website','Connect a custom domain'],
  requirements:['A computer','Internet connection','Basic computer knowledge','No professional development experience required'],
  sections:[
    {title:'Introduction',lessons:[['Welcome to the course','3:20',true,'welcome'],["What we're building",'5:40',true,'what-were-building'],["Tools you'll need",'7:15',false,'tools']]},
    {title:'Planning Your Portfolio',lessons:[["What belongs in a portfolio",'9:30',false,'portfolio-content'],['Creating the page structure','11:15',false,'page-structure']]},
    {title:'Building',lessons:[['Project setup','13:40',false,'project-setup'],['Navigation','14:10',false,'navigation'],['Hero section','17:20',false,'hero'],['About section','12:35',false,'about'],['Projects section','22:10',false,'projects'],['Contact section','13:00',false,'contact']]},
    {title:'Responsive Design',lessons:[['Mobile layout','18:10',false,'mobile'],['Tablet and desktop cleanup','14:50',false,'responsive-cleanup']]},
    {title:'Publishing',lessons:[['Preparing production files','11:20',false,'production'],['Deploying your site','16:30',false,'deploy'],['Connecting a domain','12:10',false,'domain'],['Final checklist','7:00',false,'checklist']]},
  ]
};
export const allLessons=course.sections.flatMap((s)=>s.lessons.map((l)=>({title:l[0] as string,duration:l[1] as string,preview:l[2] as boolean,slug:l[3] as string,section:s.title})));
