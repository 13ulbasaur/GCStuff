function sendQuestStats(giveUsername) 
{
    let formLink = '';
    let returnButton = null;
    let submitDiv = document.createElement("div");
    submitDiv.innerHTML = "Submitting...";
    submitDiv.id = "submitDiv";

    function taeliaRewards() {
        let rewardSpan = document.querySelector('div.center > div.flex-column.big-gap > span');
        if (rewardSpan == undefined) {
            return '';
        }
        let rewardText = rewardSpan.innerText;
        console.log(`Text: ${rewardText}`)
        //If text does not start with 'Taelia gives you a' then LEAVE.
        if (rewardText.startsWith('Taelia gives you a ') == false) {
            return '';
        }
        returnButton = document.querySelector('input.form-control[type="button"][value="Approach Taelia again..."]');
        returnButton.disabled = true;
        rewardSpan.insertAdjacentElement('afterend', submitDiv)
        //Taelia rewards should always be in the following format:
        //"Taelia gives you a Crazy Crisp Taco, Poison Snowball, and 17,983 Neopoints!!"
        //so "Taelia gives you a [Item], [SnowballItem], and [NP] Neopoints!!"
        //We need to figure out a way to split these out. Unfortunately, items can sometimes have commas in them (none of the items Taelia can reward atm does, but I want to future proof it), so we can't just split by comma.

        //I think I can work backwards instead. I know how to get the Neopoints...
        let neopoints = Number(rewardText.match(/(?! )\d*,?\d+(?= Neopoints!!)/)[0].replaceAll(',',''))
        console.log(`Neopoints: ${neopoints}`)
        //Now we get rid of the neopoints section.
        rewardText = rewardText.replace(/, and \d*,?\d+ Neopoints!!/g,'');
        console.log(`Text 2: ${rewardText}`)

        let snowBallItem = rewardText.match(/((?=, ).+ Snowball)|(, Snow \w*ball)|(, Frozen Pile of Dung)/gi)[0].trim();
        //Remove the , from the start if it's there.
        if (snowBallItem.startsWith(', ')) {
            snowBallItem = snowBallItem.slice(2).trim();
        }
        snowBallItem = encodeURIComponent(snowBallItem);
        console.log(`Snowball: ${snowBallItem}`)
        //Now get rid of the snowball section... Hoping it doesn't add a snowball that has a ', ' in it. Or a snowball that doesn't end in snowball.
        rewardText = rewardText.replace(/((?=, ).+ Snowball)|(, Snow \w*ball)|(, Frozen Pile of Dung)/gi,'')
        console.log(`Text 3: ${rewardText}`)

        //Now for the last item. We just need to remove the beginning part... and we're good!
        let item1 = encodeURIComponent(rewardText.replace('Taelia gives you a ','').trim());
        console.log(`Item: ${item1}`)
        return `https://docs.google.com/forms/d/e/1FAIpQLSd426f2LiLlDYPnvGnIt-IUOB5tfvnNjNfIujx0V_sQROGtYw/formResponse?usp=pp_url&entry.1167335245=Taelia&entry.1736384931=${neopoints}&entry.1829837696=${item1}&entry.558379744=${snowBallItem}`
    }

    function ednaRewards() {
        const npRewardSpan = document.querySelector('div#quest_grid ~span');
        const itemRewardSpan = document.querySelector('div#quest_grid ~span ~span')
        if (npRewardSpan == undefined || itemRewardSpan == undefined) {
            return '';
        }
        let npRewardText = npRewardSpan.innerText;
        console.log(`npRewardText: ${npRewardText}`)
        let itemRewardText = itemRewardSpan.innerText;
        if (npRewardText.startsWith('Yes! I have all the ingredients!') == false || itemRewardText.startsWith('The old witch gives you ') == false) {
            return '';
        }
        returnButton = document.querySelector('input.form-control[type="button"][value="Approach the witch again..."]');
        returnButton.disabled = true;
        itemRewardSpan.insertAdjacentElement('afterend', submitDiv)
        //Extract the neopoints out of the text.
        let neopoints = Number(npRewardText.match(/\d+,+\d*(?!NP!)/gi)[0].replaceAll(',',''));
        console.log(`Neopoints: ${neopoints}`)
        //Extract the items... Edna reward text can come in two forms:
        // "The old witch gives you Spooky Lime Pudding !!"
        // And if she also rewards a second item:
        //"The old witch gives you Spooky Lime Pudding and Bottled Earth Faerie!!"
        // So if she gives a second item, it'll always be a bottled faerie, I'm pretty sure. So this will be based on that since there's probably lots of items with 'and' in the name.

        //So first, let's remove the starting text that'll always be there.
        itemRewardText = itemRewardText.replace("The old witch gives you ",'');
        //And then remove the two !! at the end. Just twim two chars off the end.
        itemRewardText = itemRewardText.slice(0, -2).trim()
        console.log(`itemRewardText: ${itemRewardText}`)

        //If there is ' and Bottled [x] Faerie',  we want to split that out. If there's no extra faerie item it'll just be null.
        let faerieText = itemRewardText.match(/(?! and )Bottled .+ Faerie/g);
        console.log(`faerieText: ${faerieText}`);
        //We'll now remove the faerie text ,if it's there.
        itemRewardText = encodeURIComponent(itemRewardText.replace(/ and Bottled .+ Faerie/g,'').trim())
        console.log(`itemRewardText2: ${itemRewardText}`)
        let url = `https://docs.google.com/forms/d/e/1FAIpQLSd426f2LiLlDYPnvGnIt-IUOB5tfvnNjNfIujx0V_sQROGtYw/formResponse?usp=pp_url&entry.1167335245=Edna&entry.1736384931=${neopoints}&entry.1829837696=${itemRewardText}`
        if (faerieText != null) {
            url = url + `&entry.558379744=${encodeURIComponent(faerieText[0])}`
        }
        return url;
    }

    function esoRewards() {
        let itemRewardSpan = document.querySelector('div.center > div.flex-column.big-gap > span');
        if (itemRewardSpan == undefined) {
            return '';
        }
        let itemRewardText = itemRewardSpan.innerText;
        console.log(`Text: ${itemRewardText}`)
        //If text does not start with 'The Esophagor gives you ' then LEAVE.
        if (itemRewardText.startsWith('The Esophagor gives you ') == false) {
            return '';
        }
        let neopointRewardSpan = itemRewardSpan.nextElementSibling;
        let neopointRewardText = neopointRewardSpan.innerText;
        returnButton = document.querySelector('input.form-control[type="button"][value="Approach the Esophagor again..."]');
        returnButton.disabled = true;
        neopointRewardSpan.insertAdjacentElement('afterend', submitDiv)
        //Eso rewards will be in the following format:
        //Item: "The Esophagor gives you Roast Tentacle!!"
        //NP: "He also drops 9,360 NP; you pocket it quickly!"
        let neopoints = Number(neopointRewardText.match(/(?! )\d*,?\d+(?= NP;)/g)[0].replaceAll(',',''))
        console.log(`Neopoints: ${neopoints}`)
        //Get rid of the static text and clip of the !! at the end.
        itemRewardText = encodeURIComponent(itemRewardText.replace('The Esophagor gives you ','').slice(0, -2).trim());
        console.log(`Text 2: ${itemRewardText}`)

        return `https://docs.google.com/forms/d/e/1FAIpQLSd426f2LiLlDYPnvGnIt-IUOB5tfvnNjNfIujx0V_sQROGtYw/formResponse?usp=pp_url&entry.1167335245=Esophagor&entry.1736384931=${neopoints}&entry.1829837696=${itemRewardText}`
    }

    function kitchenRewards() {
        const rewardConfirmationSpan = document.querySelector('div#quest_grid ~span ~span')
        if (rewardConfirmationSpan == undefined) {
            return '';
        }
        //If text does not start with 'The Esophagor gives you ' then LEAVE.
        if (rewardConfirmationSpan.innerText.startsWith('The Chef waves his hands, and you may collect your prize...') == false) {
            return '';
        }
        returnButton = document.querySelector('input.form-control[type="button"][value="Approach the Chef Again"]');
        returnButton.disabled = true;
        //Look for the active pet, this is so we can check if it got a stat boost.
        const activePet = document.querySelector('#userinfo a[href*="/quickref/"]').innerText.trim();

        //Because the kitchen quest can have a few possible different formats of rewards, we'll loop through each element after the reward confirmation and do stuff based on that.
        let statBoost = '';
        let itemReward = '';
        let neopoints = '';

        let url = 'https://docs.google.com/forms/d/e/1FAIpQLSd426f2LiLlDYPnvGnIt-IUOB5tfvnNjNfIujx0V_sQROGtYw/formResponse?usp=pp_url&entry.1167335245=Kitchen'
        //Get the next element.
        let nextElement = rewardConfirmationSpan.nextElementSibling;
        while (nextElement != null && !(nextElement.tagName == "DIV" && nextElement.childElementCount == 2 && nextElement.classList.contains('half-width'))){
            //If it is a stat boost...
            if (nextElement.innerText.startsWith(`${activePet} gained `)) {
                statBoost = nextElement.innerText.match(/ of .+/g)[0].replace(' of ','').trim();
                url += '&entry.2021892051=' + statBoost
            }
            //If it is an item...
            else if (nextElement.innerText.startsWith('You get ')) {
                itemReward = encodeURIComponent(nextElement.innerText.replace('You get ','').slice(0,-2).trim());
                url += '&entry.1829837696=' + itemReward;
            }
            //If it's codestones...
            else if (nextElement.innerText.includes('a sack of codestones')) {
                url += '&entry.558379744=Codestones'
            }
            //If it's neopoints...
            else if (nextElement.innerText.startsWith('You also get ')) {
                neopoints = Number(nextElement.innerText.match(/(?! )\d*,?\d+(?= Neopoints!)/)[0].replaceAll(',',''))
                url += '&entry.1736384931=' + neopoints
            }
            nextElement = nextElement.nextElementSibling;
        }
        nextElement.insertAdjacentElement('beforebegin', submitDiv)
        return url;
    }

    function brainTreeRewards() {
        const wholeElement = document.querySelector('div.flex-column.big-gap')
        if (wholeElement == undefined || wholeElement.innerText.startsWith('Thank you, you are correct!') == false) {
            return '';
        }
        returnButton = document.querySelector('input.form-control[type="button"][value="Return to Haunted Woods"]');
        returnButton.disabled = true;
        let itemElement = wholeElement.children[3];

        itemElement.insertAdjacentElement('afterend', submitDiv)
        let itemReward = itemElement.innerText.slice(0,-2);
        return `https://docs.google.com/forms/d/e/1FAIpQLSd426f2LiLlDYPnvGnIt-IUOB5tfvnNjNfIujx0V_sQROGtYw/formResponse?usp=pp_url&entry.1167335245=Brain+Tree&entry.1829837696=${itemReward}`
    }

    //Only run if no quest items are NO. So exit if there's a single NO.
    let noNo = false;
    const itemList = document.querySelectorAll('.quest-text strong:nth-child(2)')
    //ALso get the items that were requested.
    let itemsRequested = {item0:"",item1:"",item2:"",item3:""}

    //Loop through each quest item to check if already got.
    for (let i = 0; i < itemList.length; i++) {
        if (itemList[i].innerText === "NO") {
            noNo = true;
            break;
        }
        else {
            itemsRequested['item'+i] = itemList[i].previousElementSibling.innerText;
        }
    }


    //If all the items have been gotten then the quest is done, so continue.
    if (noNo == false) {
        if (window.location.href == 'https://www.grundos.cafe/winter/snowfaerie/complete/') {
            formLink = taeliaRewards();
        }
        else if (window.location.href == 'https://www.grundos.cafe/halloween/witchtower/complete/') {
            formLink = ednaRewards();
        }
        else if (window.location.href == 'https://www.grundos.cafe/halloween/esophagor/complete/') {
            formLink = esoRewards();
        }
        else if (window.location.href == 'https://www.grundos.cafe/island/kitchen/complete/') {
            formLink = kitchenRewards();
        }
        else if (window.location.href == 'https://www.grundos.cafe/halloween/braintree/complete/') {
            formLink = brainTreeRewards();
        }

        if (formLink != '') {
            if (giveUsername) {
                formLink += '&entry.1732136035=' + document.querySelector('#userinfo a[href*="userlookup/?user="]').innerText.trim();
            }
            //Add the requested quest items.
            if (itemsRequested.item0 != "") {
                formLink += '&entry.669064702=' + itemsRequested.item0;
            }
            if (itemsRequested.item1 != "") {
                formLink += '&entry.1797043340=' + itemsRequested.item1;
            }
            if (itemsRequested.item2 != "") {
                formLink += '&entry.1426587972=' + itemsRequested.item2;
            }
            if (itemsRequested.item3 != "") {
                formLink += '&entry.1031263455=' + itemsRequested.item3;
            }

            let opts = {
                mode: "no-cors",
                //redirect: "follow",
                referrer: "no-referrer",
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                }
            }

            let response = fetch(formLink, opts)
            .then(response => {
                // handle the response
                console.log("Submitted");
                submitDiv.innerHTML = '<a href="https://docs.google.com/spreadsheets/d/1QVC_uqeNR8TlVMmpCyV3iq1sk60tRUSTTvBKIxQSUxE/edit#gid=626796503" style="color:green; text-decoration: underline">Submitted!</a>';
                returnButton.disabled = false;
            })
            .catch(error => {
                // handle the error
                console.log("Error: " + error);
                console.log(response)
                returnButton.disabled = false;
                submitDiv.innerHTML = `Failed to submit: ${error}`;
                submitDiv.style.color = "red"
            });

        }
    }
}
