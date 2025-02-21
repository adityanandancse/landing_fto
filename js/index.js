// Tasks:
// Never-see is not working on local files
const __IN_DEV__ = false;
const __CAPTURE__EVENT = !__IN_DEV__;
const __TRAFFIC_PORTION__ = 3; // 100/3 = 33%

const __LOCAL_STORAGE_KEY__ = "__app_newsletter_v0.0.2__"

const dataUtils = {
    getData: () => {
        const data = localStorage.getItem(__LOCAL_STORAGE_KEY__);
        let ob = {
            first_time: true, never: false,
        }
        if (data) {
            ob = JSON.parse(data);
        }
        return ob;
    },
    setData: (data) => {
        localStorage.setItem(__LOCAL_STORAGE_KEY__, JSON.stringify(data));
    },
    setItSeen: () => {
        dataUtils.setData({
            ...dataUtils.getData(), first_time: false
        })
    },
    setItNever: () => {
        dataUtils.setData({
            ...dataUtils.getData(), never: true
        })
    }
}

const utils = {
    createElementFromHTML: (htmlString) => {
        const div = document.createElement('div');
        div.innerHTML = htmlString.trim();
        return div.firstChild;
    },
    captureEvent: (event, props) => {
        if (__IN_DEV__)
            console.info("capturing event", event, props);
        if (!__CAPTURE__EVENT) return;
        const eventPrefix = __IN_DEV__ ? "test-" : "prod-"
        posthog.capture(eventPrefix + event, props)
    }
}


const init = () => {

    if (dataUtils.getData().never) {
        return;
    }

    initHead();

    const body = document.querySelector('body');

    if (!body) {
        return;
    }

    const element = utils.createElementFromHTML(htmlString);
    const closeButton = element.parentElement.querySelector('[data-slot=close]');
    const backdrop = element.parentElement.querySelector('[data-slot=backdrop]');
    const maximizeButton = element.parentElement.querySelector('[data-slot=maximize]');
    const newsletter = element.parentElement.querySelector('[data-component=newsletter]');
    const neverButton = element.parentElement.querySelector('[data-slot=never]');
    const mainActions = element.parentElement.querySelectorAll('[data-slot=main-action]');


    const minimize = () => {
        newsletter.setAttribute('as-toast', "");
        newsletter.removeAttribute('as-modal');
        utils.captureEvent('event', {click: "minimize"})
    }

    const maximize = () => {
        newsletter.removeAttribute('as-toast');
        newsletter.setAttribute('as-modal', "");
        utils.captureEvent('event', {click: "maximize"})
    }

    const neverSee = () => {
        dataUtils.setItNever();
        element.remove()
        utils.captureEvent('event', {click: "never-see"})
    }

    backdrop?.addEventListener('click', () => {
        minimize();
    })

    const showNewsletter = () => {
        newsletter.classList.add(dataUtils.getData().first_time ? 'as-modal' : 'as-toast');
        newsletter.setAttribute(dataUtils.getData().first_time ? 'as-modal' : 'as-toast', "");
        body.append(element);
        if (dataUtils.getData().first_time)
            utils.captureEvent('event', {see: "first-time"})
        else
            utils.captureEvent('event', {see: "repeat"})
        dataUtils.setItSeen();
    }

    const gotoPage = () => {
        window.open("https://paceui.com/",);
        utils.captureEvent('event', {goto: "paceui"})
    }

    // Listener
    closeButton?.addEventListener('click', () => {
        minimize();
    })

    maximizeButton?.addEventListener('click', () => {
        maximize()
    })

    neverButton?.addEventListener('click', () => {
        neverSee();
    })

    mainActions.forEach(e => e.addEventListener('click', () => {
        gotoPage();
    }))

    showNewsletter();
}

const initHead = () => {
    const head = document.getElementsByTagName('head')[0];
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.text = `!function(t,e){var o,n,p,r;e.__SV||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]],e=o[1]),t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}(p=t.createElement("script")).type="text/javascript",p.async=!0,p.src=s.api_host+"/static/array.js",(r=t.getElementsByTagName("script")[0]).parentNode.insertBefore(p,r);var u=e;for(void 0!==a?u=e[a]=[]:a="posthog",u.people=u.people||[],u.toString=function(t){var e="posthog";return"posthog"!==a&&(e+="."+a),t||(e+=" (stub)"),e},u.people.toString=function(){return u.toString(1)+".people (stub)"},o="capture identify alias people.set people.set_once set_config register register_once unregister opt_out_capturing has_opted_out_capturing opt_in_capturing reset isFeatureEnabled onFeatureFlags getFeatureFlag getFeatureFlagPayload reloadFeatureFlags group updateEarlyAccessFeatureEnrollment getEarlyAccessFeatures getActiveMatchingSurveys getSurveys getNextSurveyStep onSessionId".split(" "),n=0;n<o.length;n++)g(u,o[n]);e._i.push([i,s,a])},e.__SV=1)}(document,window.posthog||[]);
    posthog.init('phc_PTV4Vc282DuDrb2CHOTU3G4BvQ3aBj5WOMH4xjKNHdC', {api_host: 'https://us.i.posthog.com', person_profiles: 'identified_only'})`
    head.appendChild(script);
}

// Start when it'd need
window.addEventListener('load', () => {
    if ((new Date().getHours() % __TRAFFIC_PORTION__ === 0) || __IN_DEV__) {
        init();
    }
});

// WhatsApp Button functionality
const initWhatsAppButton = () => {
    const button = document.getElementById('whatsapp-button');
    let lastScrollTop = 0;
    let isVisible = true;

    // Show/hide button based on scroll direction
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > lastScrollTop) {
            // Scrolling down
            if (isVisible) {
                button.style.transform = 'translateY(100px)';
                isVisible = false;
            }
        } else {
            // Scrolling up
            if (!isVisible) {
                button.style.transform = 'translateY(0)';
                isVisible = true;
            }
        }
        lastScrollTop = scrollTop;
    });

    // Add smooth transition
    button.style.transition = 'all 0.3s ease-in-out';

    // Handle mobile devices
    if (window.innerWidth < 768) {
        button.classList.remove('left-6');
        button.classList.add('left-4');
    }
};

// Initialize WhatsApp button when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initWhatsAppButton();
    // ... other init code ...
});

// Handle window resize
window.addEventListener('resize', () => {
    const button = document.getElementById('whatsapp-button');
    if (window.innerWidth < 768) {
        button.classList.remove('left-6');
        button.classList.add('left-4');
    } else {
        button.classList.remove('left-4');
        button.classList.add('left-6');
    }
});
