export type Category = {
    title: string;
    content: string[];
};

export type Data = Category[];

const data: Data = [
    {
        title: 'How can I identify my hair type?',
        content: ['Answer Question 1']
    },

    {
        title: 'Will the recommended products surely work on my hair?',
        content: ['Answer Question 2']
    },

    {
        title: 'Am I required to use the recommended products? ',
        content: ['Answer Question 3']
    },
];

export default data;

