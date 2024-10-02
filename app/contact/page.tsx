export default function Contact(){

    const dataContact = [
        {
            id: 1,
            contact_name: 'title.satsuke',
            image: 'https://images.unsplash.com/photo-1552374196-c4e7ffc6e126',
            role: 'Tester',
            email: 'title.satsuke@test.com'
        },{
            id: 2,
            contact_name: 'title.satsuke',
            image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2',
            role: 'Tester',
            email: 'title.satsuke@test.com'
        },{
            id: 3,
            contact_name: 'title.satsuke',
            image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb',
            role: 'Tester',
            email: 'title.satsuke@test.com'
        },{
            id: 4,
            contact_name: 'title.satsuke',
            image: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce',
            role: 'Tester',
            email: 'title.satsuke@test.com'
        },{
            id: 5,
            contact_name: 'title.satsuke',
            image: 'https://images.unsplash.com/photo-1502685104226-ee32379fefbe',
            role: 'Tester',
            email: 'title.satsuke@test.com'
        },{
            id: 6,
            contact_name: 'title.satsuke',
            image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e',
            role: 'Tester',
            email: 'title.satsuke@test.com'
        }
    ]

    return (
        <div className="bg-[#f5f6fa]">
            <div>
                <h1 className="pt-12 pl-12 pb-2 text-start text-4xl font-medium">Contact</h1>
                <div className="grid grid-cols-4 gap-4 text-center">
                        {
                            dataContact.map((dataContacts) => (
                                <div className="justify-center">
                                    <div className="max-w-md bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                                        <a href="#">
                                            <img className="rounded-t-lg object-cover h-72 w-full" src={dataContacts.image} alt="" />
                                        </a>
                                        <div className="p-5">
                                            <a href="#">
                                                <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{dataContacts.contact_name}</h5>
                                            </a>
                                            <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">{dataContacts.email}</p>
                                            <a href="#" className="inline-flex items-center text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700">
                                                Read more
                                                <svg className="w-3.5 h-3.5 ms-2 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                                                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
                                                </svg>
                                            </a>
                                        </div>
                                    </div> 
                                </div>
                            ))
                        }
                    
                </div>
            </div>
        </div>
    )
}