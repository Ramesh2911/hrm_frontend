import React, { Component } from "react";
import axios from "axios";
import { refresh } from "../classes/auth";
import moment from "moment";

const Common = (WrappedComponent) => {
  class common extends Component {
    state = {
      ctrlDownKey: false,
    };

    callRequest(method, url, auth, data = "") {
      try {
        if (auth) {
          axios.defaults.headers.common["token"] =
            localStorage.getItem("token");
        }

        return new Promise((resolve, reject) => {
          axios({
            method: method,
            url: url,
            data: data,
          })
            .then((response) => {
              resolve(response);
            })
            .catch((error) => {
              const status = error.response ? error.response.status : null;
              if (status === 401 && auth) {
                this.showDialog("error", error.response.data.message, 3000);
                let response = refresh(error);
                response.then((res) => {
                  resolve(res);
                });
              } else {
                reject(error);
              }
            });
        });
      } catch (e) {
        console.log("Call Request Error:", e);
      }
    }

    // callRequest(method, url, auth = false, data = "") {
    //   try {
    //     return new Promise((resolve, reject) => {
    //       axios({
    //         method: method,
    //         url: url,
    //         data: data,
    //         headers: auth
    //           ? { token: localStorage.getItem("token") }
    //           : {},
    //       })
    //         .then((response) => {
    //           resolve(response);
    //         })
    //         .catch((error) => {
    //           const status = error.response ? error.response.status : null;

    //           // Handle 401 Unauthorized with token refresh if auth is required
    //           if (status === 401 && auth) {
    //             this.showDialog("error", error.response.data.message, 3000);

    //             // Call token refresh function and retry request if token is refreshed
    //             refresh(error)
    //               .then((res) => {
    //                 if (res) {
    //                   resolve(res);
    //                 } else {
    //                   reject(error); // Reject if refresh failed
    //                 }
    //               })
    //               .catch((refreshError) => {
    //                 console.error("Token refresh error:", refreshError);
    //                 reject(refreshError);
    //               });
    //           } else {
    //             // Log error details for other types of errors
    //             console.error("API call error:", error.response?.data || error.message);
    //             reject(error);
    //           }
    //         });
    //     });
    //   } catch (e) {
    //     console.error("Call Request Error:", e);
    //   }
    // }



    showDialog(type, message, timeout = 3000) {
      var classname = "flash-message alert";

      if (type === "success") {
        classname += " alert-success";
      } else if (type === "error") {
        classname += " alert-danger";
      } else if (type === "warning") {
        classname += " alert-warning";
      }

      var div = document.createElement("div");
      div.className = classname;
      div.innerHTML = message;
      document.body.appendChild(div);

      setTimeout(() => {
        var elem = document.querySelector(".flash-message");
        elem.parentNode.removeChild(elem);
      }, timeout);
    }

    showConfirmDialog(message, timeout = 5000) {
      var classname = "flash-message alert alert-warning";

      var div = document.createElement("div");
      div.className = classname;

      var content = "<div class='my-5 text-center'>";
      content += "<h6>" + message + "</h6>";
      content += "<div class='my-3'>";
      content +=
        "<button type='button' class='btn btn-sm btn-primary me-3'>Proceed</button>&nbsp;";
      content +=
        "<button type='button' class='btn btn-sm btn-secondary'>Cancel</button>";
      content += "</div>";
      content += "</div>";
      div.innerHTML = content;
      document.body.appendChild(div);

      setTimeout(() => {
        var elem = document.querySelector(".flash-message");
        elem.parentNode.removeChild(elem);
      }, timeout);
    }

    getCurrentMonth() {
      let month = moment().format("MMMM");
      return month;
    }

    getCurrentYear() {
      let year = moment().format("YYYY");
      return year;
    }

    getCurrentMonthYear() {
      let month_year = moment().format("MMMM-YYYY");
      return month_year;
    }

    getCurrentDate(dateFormat = "DD/MM/YYYY") {
      let today = moment().format(dateFormat);
      return today;
    }

    getNextDays(n = 7) {
      let days = [];
      let daysRequired = n;

      for (let i = 0; i < daysRequired; i++) {
        days.push(moment().add(i, "days").format("dddd,DD-MM-YYYY"));
      }
      return days;
    }

    getCurrentFinancialYear() {
      const now = new Date();
      const currentYear = now.getFullYear();
      const currentMonth = now.getMonth();
      let financialYear;

      // Check if the current month is after March (which marks the end of the financial year)
      if (currentMonth >= 2) {
        financialYear = `${currentYear}-${currentYear + 1}`;
      } else {
        financialYear = `${currentYear - 1}-${currentYear}`;
      }

      return financialYear;
    }

    getFormatedDateTime(datetime, format = "DD-MMM-YYYY, hh:mm A") {
      const dateTime = moment(datetime);
      const formattedDateTime = dateTime.format(format);
      return formattedDateTime;
    }

    // getFormatedDate(datetime, format = "DD-MMM-YYYY") {
    //   let dateTime;

    //   if (moment(datetime, "YYYY-MM-DD", true).isValid()) {
    //     dateTime = moment(datetime, "YYYY-MM-DD");
    //   }
    //   else if (moment(datetime, "DD-MM-YYYY", true).isValid()) {
    //     dateTime = moment(datetime, "DD-MM-YYYY");
    //   }
    //   else if (moment(datetime, "MM-DD-YYYY", true).isValid()) {
    //     dateTime = moment(datetime, "MM-DD-YYYY");
    //   }
    //   else if (moment(datetime, "YYYY-MM-DD HH:mm:ss", true).isValid()) {
    //     dateTime = moment(datetime, "YYYY-MM-DD HH:mm:ss");
    //   }
    //   else {
    //     return "Invalid date";
    //   }

    //   const formattedDateTime = dateTime.format(format);
    //   return formattedDateTime;
    // }

    getFormatedDate(datetime, format = "DD-MMM-YYYY") {
      const dateTime = moment(datetime);
      const formattedDateTime = dateTime.format(format);
      return formattedDateTime;
    }

    getFormatDate = (dateString) => {
      if (!dateString) return '';

      const [month, year] = dateString.split('-');
      const formattedDate = new Date(`${year}-${month}-01`).toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric',
      });
      return formattedDate;
    };

    // getFormatDate = (dateString) => {
    //   const [month, year] = dateString.split('-');
    //   const formattedDate = new Date(`${year}-${month}-01`).toLocaleDateString('en-US', {
    //     month: 'long',
    //     year: 'numeric',
    //   });
    //   return formattedDate;
    // };

    getCourseDuration(admission_date, month_count, format = "MMM-YYYY") {
      const admissionDate = moment(admission_date);
      const completionDate = admissionDate.clone().add(month_count, 'months');
      const monthsLeft = completionDate.diff(admissionDate, 'months');
      if (monthsLeft <= 0) {
        return 'Course completed';
      } else {
        const duration = completionDate.format(format);
        return `${monthsLeft} month(s) left (${duration})`;
      }
    }

    convertDate(dateString) {
      const date = new Date(dateString);

      const day = date.getDate();
      const month = date.getMonth() + 1;
      const year = date.getFullYear();

      const newDateString = `${day}-${month}-${year}`;

      return newDateString;
    }

    convertDateStringToYMD(dateString) {
      const date = new Date(dateString);

      const day = ("0" + date.getDate()).slice(-2);
      const month = ("0" + (date.getMonth() + 1)).slice(-2);
      const year = date.getFullYear();

      const newDateString = `${year}-${month}-${day}`;

      return newDateString;
    }

    compareDate = (from_date, to_date = null) => {
      const f_date = new Date(from_date);
      const t_date = (to_date === null) ? new Date() : new Date(to_date);
      if (t_date > f_date) {
        return true;
      } else {
        return false;
      }
    };

    compareAndEqualDate = (from_date, to_date = null) => {
      const f_date = new Date(from_date);
      const t_date = (to_date === null) ? new Date() : new Date(to_date);
      if (this.convertDateStringToYMD(t_date) > this.convertDateStringToYMD(f_date)) {
        return true;
      } else if (this.convertDateStringToYMD(f_date) === this.convertDateStringToYMD(t_date)) {
        return true;
      } else {
        return false;
      }
    };

    getDateObj(timestamp) {
      let date = new Date(timestamp * 1000),
        datevalues = {
          year: date.getFullYear(),
          month: ("0" + (date.getMonth() + 1)).slice(-2),
          date: ("0" + date.getDate()).slice(-2),
          hrs: ("0" + date.getHours()).slice(-2),
          min: ("0" + date.getMinutes()).slice(-2),
          sec: ("0" + date.getSeconds()).slice(-2),
        };

      return datevalues;
    }

    getExcerpt(text, len = 120) {
      if (text === "") {
        return text;
      } else {
        if (text.length > len) {
          let excerpt = text.substr(0, len) + " ...";
          return excerpt;
        } else {
          return text;
        }
      }
    }

    ucFirst(text) {
      const textCapitalized = text.charAt(0).toUpperCase() + text.slice(1);
      return textCapitalized;
    }

    getLowerCase(text) {
      return text.toLowerCase();
    }

    getCurrencyFormat(number) {
      let cur = new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
      }).format(number);

      return cur;
    }

    displayDashboardCurrency(number) {
      let cur = new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
      }).format(number);

      const [wholePart, decimalPart] = cur.split('.');

      return (
        <>
          {wholePart}<span className="small-superscript"><sup>{decimalPart}</sup></span>
        </>
      );
    }


    changeUrlToTitle(str, wordToReplace = "-", wordByReplace = " ") {
      let modified_string = "";
      const words = str.split(wordToReplace);

      for (let i = 0; i < words.length; i++) {
        words[i] = words[i][0].toUpperCase() + words[i].substr(1);
      }

      modified_string = words.join(wordByReplace);

      return modified_string;
    }

    generateHours() {
      const startHour = 6; // Starting hour (06:00 AM)
      const endHour = 22; // Ending hour (10:00 PM)

      const hours = [];

      for (let hour = startHour; hour <= endHour; hour++) {
        for (let minute = 0; minute < 60; minute += 30) {
          const currentTime = new Date().setHours(hour, minute);
          const formattedTime = new Date(currentTime).toLocaleString("en-IN", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          });

          hours.push(formattedTime.toUpperCase());
        }
      }
      return hours;
    }

    validateEmail(email) {
      const re =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(String(email).toLowerCase());
    }

    validatePAN(pan) {
      const regex = new RegExp(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/);
      if (regex.test(pan) === true) {
        return true;
      }
      else {
        return false;
      }
    }

    checkAlphaOnly(item) {
      const alphaOnlyPattern = new RegExp("^[a-zA-Z .]+$");
      return alphaOnlyPattern.test(item);
    }

    checkNumericOnly(item) {
      const numericOnlyPattern = new RegExp("^[0-9 ]+$");
      return numericOnlyPattern.test(item);
    }

    handleKeyPress = (event) => {
      const keyCode = event.charCode || event.keyCode;

      if (keyCode === 0 || keyCode === 8 || keyCode === 9 || keyCode === 46) return true;

      if (keyCode === 17) this.setState(prevState => { return { ...prevState, ctrlDownKey: true }; });
      if (this.state.ctrlDownKey && (keyCode === 86 || keyCode === 67)) return true;

      if (keyCode < 48) {
        event.preventDefault();
      } else if (keyCode > 57) {
        if (keyCode < 96 || keyCode > 105) {
          event.preventDefault();
        }
        else {
          return true;
        }
      }
    };

    getFileType = (file) => {
      let type;
      let source;
      let regexp =
        /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-)[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-)[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S)?$/;

      if (regexp.test(file)) {
        if (file.match(/\.(jpeg|jpg|png)$/)) {
          type = "image";
          source = file;
        } else {
          type = "video";
          source = file;
        }
      } else {
        type = file.type.split("/")[0];
        source = URL.createObjectURL(file);
      }

      return type + "~" + source;
    };

    isValidDate(dateString) {
      let regexPattern = /^\d{4}-\d{2}-\d{2}$/;
      if (!regexPattern.test(dateString)) {
        return false;
      } else {
        return true;
      }
    }

    getFiYear() {
      var today = new Date();
      var currentYear = today.getFullYear();
      var nextYear = currentYear + 1;

      if ((today.getMonth() + 1) <= 3) {
        return (currentYear - 1) + "-" + currentYear.toString().slice(2);
      } else {
        return currentYear + "-" + nextYear.toString().slice(2);
      }
    }


    getFinancialYear() {
      var fiscalyear = "";
      var today = new Date();
      if ((today.getMonth() + 1) <= 3) {
        fiscalyear = (today.getFullYear() - 1) + "-" + today.getFullYear();
      } else {
        var admissionfiscalyear = (today.getFullYear() + 1).toString().slice(2);
        fiscalyear = today.getFullYear() + "-" + (admissionfiscalyear);
      }
      return fiscalyear;
    }

    convertString(input) {
      const stringMap = {
        "month": "Current Month",
        "prevmonth": "Last Month",
        "quarter": "Current Quarter",
        "prevquarter": "Last Quarter",
        "year": "Year to date",
        "prevyear": "Last year to date",
      };

      return stringMap[input] || input;
    }

    dateCompare = (a, b) => {
      const dateA = new Date(a.stud_admission_date);
      const dateB = new Date(b.stud_admission_date);
      const timestampA = dateA.getTime();
      const timestampB = dateB.getTime();
      const timestampInSecondsA = Math.floor(timestampA / 1000);
      const timestampInSecondsB = Math.floor(timestampB / 1000);

      const orderA = timestampInSecondsA;
      const orderB = timestampInSecondsB;

      let comparison = 0;
      if (orderA < orderB) {
        comparison = -1;
      } else if (orderA > orderB) {
        comparison = 1;
      }
      return comparison;
    };

    courseNameCompare = (a, b) => {
      const orderA = (a.course_name || '').toLowerCase();
      const orderB = (b.course_name || '').toLowerCase();

      let comparison = 0;
      if (orderA < orderB) {
        comparison = -1;
      } else if (orderA > orderB) {
        comparison = 1;
      }
      return comparison;
    };

    addEllipsis = (text, maxLength) => {
      if (text.length <= maxLength) {
        return text;
      } else {
        return text.substring(0, maxLength) + '...';
      }
    };

    getMonth() {
      const month = {
        "01": "JANUARY",
        "02": "FEBRUARY",
        "03": "MARCH",
        "04": "APRIL",
        "05": "MAY",
        "06": "JUNE",
        "07": "JULY",
        "08": "AUGUST",
        "09": "SEPTEMBER",
        "010": "OCTOBER",
        "011": "NOVEMBER",
        "012": "DECEMBER",
      };
      return month;
    }

    render() {
      return (
        <WrappedComponent
          callRequest={this.callRequest}
          showDialog={this.showDialog}
          showConfirmDialog={this.showConfirmDialog}
          getCurrentMonth={this.getCurrentMonth}
          getCurrentYear={this.getCurrentYear}
          getCurrentMonthYear={this.getCurrentMonthYear}
          getCurrentDate={this.getCurrentDate}
          getNextDays={this.getNextDays}
          getCurrentFinancialYear={this.getCurrentFinancialYear}
          getFormatedDateTime={this.getFormatedDateTime}
          getFormatedDate={this.getFormatedDate}
          getFormatDate={this.getFormatDate}
          getCourseDuration={this.getCourseDuration}
          convertDate={this.convertDate}
          compareDate={this.compareDate}
          courseNameCompare={this.courseNameCompare}
          compareAndEqualDate={this.compareAndEqualDate}
          convertDateStringToYMD={this.convertDateStringToYMD}
          getDateObj={this.getDateObj}
          getExcerpt={this.getExcerpt}
          ucFirst={this.ucFirst}
          getLowerCase={this.getLowerCase}
          getCurrencyFormat={this.getCurrencyFormat}
          displayDashboardCurrency={this.displayDashboardCurrency}
          changeUrlToTitle={this.changeUrlToTitle}
          getWeekdayNames={this.getWeekdayNames}
          getDuration={this.getDuration}
          getMonth={this.getMonth}
          generateHours={this.generateHours}
          validateEmail={this.validateEmail}
          checkAlphaOnly={this.checkAlphaOnly}
          checkNumericOnly={this.checkNumericOnly}
          handleKeyPress={this.handleKeyPress}
          isValidDate={this.isValidDate}
          getFinancialYear={this.getFinancialYear}
          getFiYear={this.getFiYear}
          validatePAN={this.validatePAN}
          convertString={this.convertString}
          dateCompare={this.dateCompare}
          addEllipsis={this.addEllipsis}
          {...this.props}
        />
      );
    }
  }

  return common;
};

export default Common;
