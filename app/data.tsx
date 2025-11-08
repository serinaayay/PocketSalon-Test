export type Category = {
    title: string;
    content: string[];
};

export type Data = Category[];

const data: Data = [
    {
        title: 'How can I identify my hair type?',
        content: ['There are 4 main hair types:\n\n• Type 1: Straight\n• Type 2: Wavy\n• Type 3: Curly\n• Type 4: Kinky/Coily \n\nUse our app\'s detection feature to identify YOUR hair type!']
    },

    {
        title: 'Will the recommended products surely work on my hair?',
        content: ['Answer Question 2']
    },

    {
        title: 'Am I required to use the recommended products? ',
        content: ['No! The recommended products are suggestions based on your hair analysis. You can choose to use them or explore other options that suit your preferences and budget.']
    },
];

export default data;

