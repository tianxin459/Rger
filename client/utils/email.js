let template = `
 <style>
        * {
            --color-green: #abfb32;
            --color-gray: #293232;
            --color-purple: #d03ed0;
            --color-black: #222222;
        }
        
        .header {
            padding: 5px;
            background-color: var(--color-black);
            width: 100%;
            color: var(--color-green);
        }
        
        .title {
            margin: 0px;
            padding: 10px 2px;
            background-color: var(--color-black);
            color: white;
        }
        
        .title * {
            padding: 2px;
            margin: 2px;
        }
        
        .title .title-s {
            color: var(--color-green);
        }
        
        .content {
            width: 90%;
            display: flex;
            flex-direction: row;
            box-shadow: 2px 2px 3px #888888;
            margin: 20px;
        }
        
        .spliter {
            width: 0px;
            height: 150px;
            align-self: center;
            border: 1px solid var(--color-black);
        }
        
        .content .left,
        .content .right {
            padding: 10px;
            width: 45%;
        }
        
        .detail {
            margin-top: 10px;
        }
        
        .detail * {
            margin: 2px;
        }
        .footer {
            margin: 40px;
            font-size: small;
            font-style: italic;
        }
    </style>
    <div class="content">
        <div class="left">
            <p>Participants: {joinNum}</p>
            <div>
                {joiner}
            </div>
        </div>
        <div class="spliter"></div>
        <div class="right">
            <div class="title">
                <h2>Event: <span class="title-s">{title}</span></h2>
            </div>
            <div class="detail">
                <h3>Detail:</h3>
                <p>{content}</p>
                <h3>Time:</h3>
                <p>{time}</p>
            </div>
        </div>
     
    </div>
     <div class="footer">This is a system generated Email, please do not reply.</div>
`


module.exports.template = template;