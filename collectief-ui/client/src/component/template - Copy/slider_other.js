import React from "react";
import Cookies from 'universal-cookie';
import { ToastContainer, toast } from 'react-toastify';
import { store, useGlobalState } from 'state-pool';
import 'react-toastify/dist/ReactToastify.css';
import right from '../../assets/image/right.png';
import left from '../../assets/image/left.png';
import menu_video from '../../assets/image/menu_video.png';
import menu_analyse from '../../assets/image/menu_analyse.png';
import menu_data from '../../assets/image/menu_data.png';
import menu_user from '../../assets/image/menu_user.png';
import menu_company from '../../assets/image/menu_company.png';
import menu_logout from '../../assets/image/menu_logout.png';
import menu_home from '../../assets/image/menu_home.png';
import menu_video_b from '../../assets/image/menu_video_b.png';
import menu_analyse_b from '../../assets/image/menu_analyse_b.png';
import menu_data_b from '../../assets/image/menu_data_b.png';
import menu_user_b from '../../assets/image/menu_user_b.png';
import menu_company_b from '../../assets/image/menu_company_b.png';
import right_logo from '../../assets/image/defaultlogo6_right.png';
import left_logo from '../../assets/image/defaultlogo6.png';
//import menu_logout_b from '../../assets/image/menu_logout.png';
import menu_home_b from '../../assets/image/menu_home_b.png';
import play_video from '../../assets/image/play_video.png';
import { ProgressBar } from 'react-bootstrap';
import $ from "jquery";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAdd, faMinus, faGear, faTemperature0, faPowerOff, faArrowRight, faArrowLeft, faInfo, faCircleInfo, faInfoCircle, faHome, faClock, faVolumeControlPhone, faWarning, faExchange, faList, faPlus, faUser, faLocation, faLocationDot, faBars } from '@fortawesome/free-solid-svg-icons';
var menus = [{ title: "Dashboard", icon: <FontAwesomeIcon icon={faHome} className="arrow3-menu" />, icon_b: <FontAwesomeIcon icon={faHome} className="arrow3-menu-b" />, uri: "/home" }, { title: "Sensors info", uri: "/sensors/list_sensors", icon: <FontAwesomeIcon icon={faCircleInfo} className="arrow3-menu" />, icon_b: <FontAwesomeIcon icon={faCircleInfo} className="arrow3-menu-b" />, submenues: [{ "title": "List", "icon": <FontAwesomeIcon icon={faList} className="arrow4" />, uri: "/sensors/list_sensors", "id": "2" }, { "title": "Locations", uri: "/sensors/locations", "icon": <FontAwesomeIcon icon={faLocationDot} className="arrow4" />, "id": "3" }, { "title": "Assign", uri: "/sensors/assignment", "icon": <FontAwesomeIcon icon={faExchange} className="arrow4" />, "id": "4" }] }, { title: "Users", uri: "/users", icon: <FontAwesomeIcon icon={faUser} className="arrow3-menu" />, icon_b: <FontAwesomeIcon icon={faUser} className="arrow3-menu-b" />, submenues: [{ "title": "List", uri: "/users/list_users", "icon": <FontAwesomeIcon icon={faList} className="arrow4" />, "id": "9" }, { "title": "Create", uri: "/users/create_users", "icon": <FontAwesomeIcon icon={faPlus} className="arrow4" />, "id": "10" }] }, { title: "Send Feedback", uri: "/control", icon: <FontAwesomeIcon icon={faVolumeControlPhone} className="arrow3-menu" />, icon_b: <FontAwesomeIcon icon={faVolumeControlPhone} className="arrow3-menu-b" /> }, { title: "Logout", uri: "", icon: <FontAwesomeIcon icon={faPowerOff} className="arrow3-menu" />, icon_b: <FontAwesomeIcon icon={faPowerOff} className="arrow3-menu-b" /> }];

class Slider extends React.Component {

    constructor(props) {

        super(props);
        this.togglemenu = this.togglemenu.bind(this);
        this.state = {
            isActive: true,
            menu_: false,
            menus: menus,
            current: 0,
            menu_id: -1
        }

    }


    componentDidMount() {

        var cookies = new Cookies();

        if (cookies.get('menu_') === "true") {

            //this.togglemenu();

        }
        for (var id in menus) {
            if (window.location.pathname.indexOf(menus[id].uri.toLocaleLowerCase()) !== -1 && menus[id].uri != "") {
                this.setState({
                    menu_id: id
                })
            }
            else if (menus[id].submenues) {
                for (var key in menus[id].submenues) {
                    if (window.location.pathname.indexOf(menus[id].submenues[key].uri.toLocaleLowerCase()) !== -1 && menus[id].submenues[key].uri != "") {
                        this.setState({
                            menu_id: id
                        })
                    }
                }
            }
        }

        this.initialize()

        var page_size = { width: $(window).width(), height: $(window).height() };
        if (page_size.width > 756) {

        } else {
            //$(".menu").addClass("menu-close-mobile");
        }


        $(".menu-crtl").click(function () {
            //alert($("#menu_stat").val());
            var page_size = { width: $(window).width(), height: $(window).height() };
            if (page_size.width > 1056) {
                if ($("#menu_stat").val() == "false")
                    $(".main_panel").css("left", window.innerWidth * 0.07);
                else
                    $(".main_panel").css("left", window.innerWidth * 0.16);
                if ($("#menu_stat").val() == "false") {
                    $(".main_panel").css("width", window.innerWidth * 0.91);
                    $(".main_content").css("width", window.innerWidth * 0.91);
                }
                else {
                    $(".main_content").css("width", window.innerWidth * 0.81);
                    $(".main_panel").css("width", window.innerWidth * 0.81);
                }
            }
        });

    }

    initialize() {

        // Register an event listener to call the resizeCanvas() function
        // each time the window is resized.
        //window.addEventListener('resize', this.resizeCanvas, false);
        var page_size = { width: $(window).width(), height: $(window).height() };
        //alert(page_size.width)
        if (page_size.width > 1056) {
            $(".main_panel").css("left", window.innerWidth * 0.16);
        } else {
            //$(".menu").addClass("menu-close-mobile");
        }
        /* var page_size = { width: $(window).width(), height: $(window).height() };
         const [width, height] = [window.innerWidth, window.innerHeight];
         if (page_size.width < 756) {
             if (this.state.isActive) {
                 this.setState({
                     divstyle: {
                         width: width * 0.5
                     }
                 });
             } else {
                 this.setState({
                     divstyle: {
                         width: width * 0.25
                     }
                 });
             }
         }*/
        $(".App").css("height", window.innerHeight);
        // Draw canvas border for the first time.
        this.resizeCanvas();
    }



    resizeCanvas() {
        var page_size = { width: $(window).width(), height: $(window).height() };
        //alert("0")
        for (var i = 0; i < 10; i++) {
            $("#row_add_" + i).css("height", $("#row_" + i).height())
        }
        $(".topleft").css("width", window.innerWidth * 0.35);
        $(".rightbottom").css("width", window.innerWidth * 0.45);
        //$(".rightbottom").css("right",window.innerWidth*0.1);
        if (page_size.width > 1056) {
            if ($("#menu_stat").val() == "true")
                $(".main_panel").css("left", window.innerWidth * 0.07);
            else
                $(".main_panel").css("left", window.innerWidth * 0.07);
            if ($("#menu_stat").val() == "true") {
                $(".main_panel").css("width", window.innerWidth * 0.91);
                $(".main_content").css("width", window.innerWidth * 0.91);
            }
            else {
                $(".main_content").css("width", window.innerWidth * 0.91);
                $(".main_panel").css("width", window.innerWidth * 0.91);
            }

        }
        console.log(page_size);
        var p_width = 0;
        $(".col-left").css("display", "block");
        $(".menu").css("height", page_size.height);
        $(".menu-open").css("width", page_size.width * 0.15);
        $(".menu-close").css("width", page_size.width * 0.06);
        //$(".menu-h-open").css("width", page_size.width * 0.02);
        // $(".menu-h-close").css("width", page_size.width * 0.02);
        $(".login_container").css("border-radius", "25px");
        $("body").css("background-color", "#F5F5FD");
        $(".topright").css("width", (0.65 * page_size.width));
        $(".topright").css("height", (0.35 * page_size.height));
        $(".logo").css("left", (0.12 * page_size.width));
        $(".logo").css("width", (0.15 * page_size.width));
        $(".logo").css("top", (0.0005 * page_size.height));
        if (page_size.width > 1056) {
            $(".left_img").css("width", (0.3 * page_size.width));
            $(".col-right").css("width", (0.2 * page_size.width));
            $(".col-right").css("max-height", (0.8 * page_size.height));
            $(".input_text").css("width", (0.2 * page_size.width));
            $(".login_b").css("width", (0.2 * page_size.width));
            $(".login_b2").css("width", (0.2 * page_size.width));
            $(".left_img").css("height", (0.7 * page_size.height));
            $(".v_m").css("height", (0.2 * page_size.width));
            //$(".login_container").css("height",0.8*page_size.height);
            $(".login_container_l2").css("width", 0.6 * page_size.width);
            $(".login-top").css("margin-top", 0.1 * page_size.height);
            $(".login-top").css("margin-bottom", 0.1 * page_size.height);
            $(".login_container").css("box-shadow", "0px 36.0424px 56.909px rgb(0 0 0 / 15%)");
        }
        else if (page_size.width > 956) {
            $(".menu-open").css("width", page_size.width * 0.25);
            $(".left_img").css("width", (0.3 * page_size.width));
            $(".col-right").css("width", (0.4 * page_size.width));
            $(".col-right").css("max-height", (0.8 * page_size.height));
            $(".input_text").css("width", (0.3 * page_size.width));
            $(".login_b").css("width", (0.3 * page_size.width));
            $(".login_b2").css("width", (0.3 * page_size.width));
            $(".left_img").css("height", (0.7 * page_size.height));
            $(".v_m").css("height", (0.2 * page_size.width));
            //$(".login_container").css("height",0.7*page_size.height);
            $(".login_container_l2").css("width", 0.8 * page_size.width);
            $(".login-top").css("margin-top", 0.1 * page_size.height);
            $(".login-top").css("margin-bottom", 0.1 * page_size.height);
            $(".login_container").css("box-shadow", "0px 36.0424px 56.909px rgb(0 0 0 / 15%)");
        }
        else if (page_size.width > 856) {
            $(".menu-open").css("width", page_size.width * 0.25);
            $(".left_img").css("width", (0.3 * page_size.width));
            $(".col-right").css("width", (0.4 * page_size.width));
            $(".col-right").css("max-height", (0.8 * page_size.height));
            $(".input_text").css("width", (0.2 * page_size.width));
            $(".login_b").css("width", (0.2 * page_size.width));
            $(".login_b2").css("width", (0.2 * page_size.width));
            $(".left_img").css("height", (0.7 * page_size.height));
            $(".v_m").css("height", (0.2 * page_size.width));
            //$(".login_container").css("height",0.8*page_size.height);
            $(".login_container_l2").css("width", 0.9 * page_size.width);
            $(".login-top").css("margin-top", 0.1 * page_size.height);
            $(".login-top").css("margin-bottom", 0.1 * page_size.height);
            $(".login_container").css("box-shadow", "0px 36.0424px 56.909px rgb(0 0 0 / 15%)");
        }
        else if (page_size.width > 756) {
            $(".menu-open").css("width", page_size.width * 0.25);
            $(".left_img").css("width", (0.3 * page_size.width));
            $(".col-right").css("width", (0.4 * page_size.width));
            $(".col-right").css("max-height", (0.8 * page_size.height));
            $(".input_text").css("width", (0.2 * page_size.width));
            $(".login_b").css("width", (0.2 * page_size.width));
            $(".login_b2").css("width", (0.2 * page_size.width));
            $(".left_img").css("height", (0.7 * page_size.height));
            //$(".v_m").css("height", (0.2 * page_size.width));
            //$(".login_container").css("height",0.8*page_size.height);
            $(".login_container_l2").css("width", 0.9 * page_size.width);
            $(".login-top").css("margin-top", 0.1 * page_size.height);
            $(".login-top").css("margin-bottom", 0.1 * page_size.height);
            $(".login_container").css("box-shadow", "0px 36.0424px 56.909px rgb(0 0 0 / 15%)");
        }
        else if (page_size.width < 756) {
            //$(".menu-h-open").css("width", page_size.width * 0.04);
            //$(".menu-h-close").css("width", page_size.width * 0.04);
            $(".menu-open").css("width", page_size.width * 0.25);
            $(".menu-close").css("width", page_size.width * 0.15);
            $(".col-right").css("width", page_size.width);
            $(".col-left").css("display", "none");
            $(".input_text").css("width", 0.8 * page_size.width);
            $(".login_b").css("width", 0.8 * page_size.width);
            $(".login_b2").css("width", 0.8 * page_size.width);
            $(".col-right").css("margin-left", 0.1 * page_size.width);
            $(".v_m").css("height", (0.3 * page_size.height));
            $(".login_container").css("height", page_size.height);
            $(".login-top").css("margin-bottom", 0 * page_size.height);
            $(".login_l2").css("font-size", "20px");
            $(".login_container").css("box-shadow", "0px 0px 0px");
            $(".login_container").css("border-radius", "0px");
            //$("body").css("background-color","#fff");
        }
        else {

        }
        var he = $(".panels").height();



    }


    togglemenu() {

        console.log("x");
        console.log(this.page_size);
        const currentState = this.state.isActive;
        const [width, height] = [window.innerWidth, window.innerHeight];
        console.log(width);
        this.setState({ isActive: !currentState });
        if (this.state.menu_) {
            var cookies = new Cookies();
            cookies.set('menu_', 'false', { path: '/' });
            //this.setState({ menu_: false });
        } else {
            var cookies = new Cookies();
            cookies.set('menu_', 'true', { path: '/' });
            //this.setState({ menu_: true });
        }


        var page_size = { width: $(window).width(), height: $(window).height() };
        if (page_size.width < 756) {
            if (this.state.isActive) {
                this.setState({
                    divstyle: {
                        width: width * 0.5
                    }
                });
            } else {
                this.setState({
                    divstyle: {
                        width: width * 0.15
                    }
                });
            }
        }
        else if (page_size.width < 1056) {
            if (this.state.isActive) {
                this.setState({
                    divstyle: {
                        width: width * 0.25
                    }
                });
            } else {
                this.setState({
                    divstyle: {
                        width: width * 0.15
                    }
                });
            }
        } else {
            if (this.state.isActive) {
                this.setState({
                    divstyle: {
                        width: width * 0.13
                    }
                });
            } else {
                this.setState({
                    divstyle: {
                        width: width * 0.06
                    }
                });
            }
        }


    }

    logout() {
        setTimeout(() => {
            window.location.href = "/";
        }, 2000);
        var cookies = new Cookies();
        //cookies.set('token', result.token, { path: '/' });
        console.log("cookies=" + cookies.get('token'));
        return fetch('http://' + global.config.vals.root.ip + ':3002/logout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ token: cookies.get('token') })
        })
            .then(data => data.json())
            .then(
                (result) => {
                    /*this.setState({
                      isLoaded: true,
                      items: result.items
                    });*/
                    console.log(result);
                    if (result.message == "1") {

                        toast.info('Logout was successful', {
                            position: "top-right",
                            autoClose: 2500,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                            progress: undefined,
                        });

                        var cookies1 = new Cookies();
                        cookies1.remove("token");
                        cookies1.remove("topright");
                        cookies1.remove("logo_type");
                        cookies1.remove("logo");
                        cookies1.remove("company_id");
                        setTimeout(() => {
                            window.location.href = "/";
                        }, 2000);


                    } else {

                        var cookies1 = new Cookies();
                        cookies1.remove("token");
                        setTimeout(() => {
                            // window.location.href = "/";
                        }, 2000);

                    }

                },
                // Note: it's important to handle errors here
                // instead of a catch() block so that we don't swallow
                // exceptions from actual bugs in components.
                (error) => {
                    this.setState({
                        isLoaded: true,
                        error
                    });
                }
            )

    }

    choose_menu(id) {

        this.setState({ current: id, "menu_id": id });
        const worker = new Worker('./worker.js');
        var k = 0;

        switch (id) {

            case 0:
                window.location.href = "/home";
                break;
            case 1:
                //window.location.href = "/schedule/setting";
                break;
            case 2:
                //window.location.href = "/sensors/list_sensors";
                break;
            case 3:
                //window.location.href = "/control/setting";
                window.location.href = "/control/setting";
                break;
            case 4:
                //window.location.href = "/show_data";
                //window.location.href = "/control/setting";
                this.logout();
                break;
            case 5:
                //window.location.href = "/show_data";
                this.logout();
                break;
            case 6:
                this.logout();
                break;
            case 9:
                window.location.href = "/users/list_users";
                break;
            case 10:
                window.location.href = "/users/create_users";
                break;
            case 7:
                this.logout();
                break;

        }

    }


    choose_menu2(id) {
        //alert(id)
        //this.setState({ current: id, "menu_id": id });
        //const worker = new Worker('./worker.js');
        var k = 0;
        //   var k = 0;

        switch (parseInt(id)) {

            case 0:
                window.location.href = "/home";
                break;
            case 1:
                window.location.href = "/schedule/setting";
                break;
            case 2:
                // alert("xxx")
                window.location.href = "/sensors/list_sensors";
                break;
            case 3:
                window.location.href = "/sensors/locations";
                break;
            case 4:
                //window.location.href = "/show_data";
                window.location.href = "/sensors/assignment";
                break;
            case 5:
                //window.location.href = "/show_data";
                this.logout();
                break;
            case 9:
                window.location.href = "/users/list_users";
                break;
            case 10:
                window.location.href = "/users/create_users";
                break;
            case 7:
                this.logout();
                break;

        }

    }

    render_menus() {

        var context = this;

        return context.state.menus.map(function (o, i) {

            return (context.set_menu(i));

        });

    }

    renderSubMenues(id) {

        var context = this;
        if (menus[id].submenues) {
            return menus[id].submenues.map(function (o, key) {
                ////console.log(context.state.temlate[key].position)


                if (context.state.menu_id == id) {
                    return (
                        <div className="ml-3 mt-2" onClick={(event) => context.choose_menu2(menus[id].submenues[key].id)} title={menus[id].submenues[key].title}>
                            <div style={{ "display": "inline-table" }}>
                                {menus[id].submenues[key].icon}
                            </div>
                            <div style={{ "display": "inline-table" }} className="ml-4" class={context.state.isActive ? 'menu-item-text d-none' : 'menu-item-text ml-3'}>
                                {menus[id].submenues[key].title}
                            </div>
                        </div>
                    )
                } else {
                    return (
                        <div className="ml-3 mt-2 d-none" onClick={(event) => context.choose_menu2(menus[id].submenues[key].id)} title={menus[id].submenues[key].title}>
                            <div style={{ "display": "inline-table" }}>
                                {menus[id].submenues[key].icon}
                            </div>
                            <div style={{ "display": "inline-table" }} className="ml-4" class={context.state.isActive ? 'menu-item-text d-none' : 'menu-item-text ml-3'}>
                                {menus[id].submenues[key].title}
                            </div>
                        </div>
                    )
                }



            });
        }

    }

    set_menu(id) {

        console.log(window.location.pathname);
        console.log(menus[id].title);
        console.log("indexOf===" + window.location.pathname.indexOf(menus[id].title.toLocaleLowerCase()));

        if ((window.location.pathname.indexOf(menus[id].uri.toLocaleLowerCase()) !== -1 && menus[id].uri != "") || this.state.menu_id == id) {

            return (<div class="menu-item border-right-n"  >

                <div onClick={() => this.choose_menu(id)} title={menus[id].title}>
                    <div class="icon icon-shape bg-gr-primary shadow text-center border-radius-md" style={{ display: "inline-table" }}>

                        {menus[id].icon_b}
                    </div>
                    <div class={this.state.isActive ? 'menu-item-text-b hide' : 'menu-item-text-b ml-3'}>
                        {menus[id].title}
                    </div>
                </div>
                <div>
                    {this.renderSubMenues(id)}
                </div>
            </div>
            );

        } else {

            return (<div class="menu-item" title={menus[id].title}>
                <div onClick={() => this.choose_menu(id)}>
                    <div class="icon icon-shape icon-sm shadow border-radius-md bg-white text-center  align-items-center justify-content-center" style={{ display: "inline-table" }}>
                        {menus[id].icon}
                    </div>
                    <div class={this.state.isActive ? 'menu-item-text hide' : 'menu-item-text ml-3'}>
                        {menus[id].title}
                    </div>
                </div>
                <div>
                    {this.renderSubMenues(id)}
                </div>
            </div>
            );

        }

    }



    render() {

        var context = this;
        return (

            <div class={this.state.isActive ? 'menu menu-close' : 'menu menu-open'} style={this.state.divstyle}>
                <input type="hidden" id="menu_stat" value={this.state.menu_} />
                <div class="menu-crtl">
                    <FontAwesomeIcon class={this.state.isActive ? 'menu-h-close' : 'menu-h-open'} onClick={(e) => this.togglemenu()} icon={faBars} id="vertical-menu" style={{ "cursor": "pointer", width: "40px", height: "40px", "position": "relative", "top": "2px" }} />

                </div>

                <div class={this.state.isActive ? 'menu-close-mobile' : 'menu-open-mobile'}>
                    {this.render_menus()}
                    <div className={'slider-logo'}>
                        <div>
                            <img src={this.state.isActive ? right_logo : left_logo} />
                        </div>
                    </div>
                </div>
            </div>

        );
    }

}

export default Slider;
