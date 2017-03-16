import json
from flask import jsonify, abort

from flask import Blueprint, render_template, flash, request, redirect, url_for, current_app, send_from_directory, session, g
from flask_login import current_user, login_user, logout_user, login_required

from app.extensions import cache
from app.forms import LoginForm
from app.models import db, User

main = Blueprint('main', __name__)


@main.before_request
def before_request():
    g.user = current_user


@main.route('/')
@cache.cached(timeout=1000)
def landing():
    if not session.get('logged_in'):
        return redirect("/login")
    else:
        return redirect("/trading")


@main.route('/trading')
@login_required
@cache.cached(timeout=1000)
def trading():
    return current_app.send_static_file('trading.html')


@main.route('/terms')
@cache.cached(timeout=1000)
def terms():
    return current_app.send_static_file('terms.html')


@main.route('/<path:url>')
def root_cmd(url=None):
    if url == '_ping':
        return jsonify({'ping':'pong'})
    elif url == 'favicon.ico':
        return send_from_directory('assets', url)
    else:
        abort(404)


@main.route('/trading/<path:url>')
def trading_forms(url=None):
    if url == '_form':
        return current_app.send_static_file('trading_form.html')
    elif url == '_order_history':
        return jsonify([])
    else:
        abort(404)


@main.route('/interface')
@cache.cached(timeout=1000)
def interface():
    return current_app.send_static_file('interface.html')


@main.route('/assets/<path:path>')
def send_js(path):
    return send_from_directory('C:\\trading\\frontend\\app\\assets', path)


@main.route('/tv/<path:path>')
def send_tv(path):
    return send_from_directory('tv', path)


@main.route('/notifications/')
@main.route('/notifications/<path:url>')
def notification(url=None):
    if url == '_all':
        with open('/home/bzero/devel/trading/frontend/notification.json', 'r') as json_file:
            data = json_file.read().replace('\n', '')
            result = json.loads(data)
            return jsonify(result)
    elif url == '_alerts':
        return current_app.send_static_file('alerts.html')
    else:
        abort(404)


@main.route('/modals/')
@main.route('/modals/<path:url>')
def modal(url=None):
    if url == 'interface_settings':
        return current_app.send_static_file('interface_settings.html')
    elif url == '_algo_order':
        return current_app.send_static_file('algoorder.html')
    else:
        abort(404)


@main.route('/account/<path:url>/')
def account(url=None):
    if url == '_ping':
        return jsonify({'ping':'pong'})


@main.route('/account/_update_ui_setting/', methods=['GET', 'POST'])
def account_update_ui_setting():
    return ""


@main.route('/account/_bootstrap/')
@main.route('/account/_bootstrap/?=<path:url>')
def account_bootstrap(url=None):
    data = ""
    with open('/home/bzero/devel/trading/frontend/account.json', 'r') as json_file:
        data = json_file.read().replace('\n', '')
        result = json.loads(data)
        return jsonify(result)


@main.route("/login", methods=["GET", "POST"])
def login():
    if request.method == 'POST':
        r = {'result': 'fail'}
        username = request.form['user']
        registered_user = User.query.filter_by(username=username).first()
        if registered_user is not None:
            password = request.form['pwd']
            if registered_user.check_password(password):
                login_user(registered_user)
                r = {'result': 'ok'}
        return jsonify(r)
    else:
        return current_app.send_static_file('login.html')


@main.route("/register", methods=["GET", "POST"])
def register():
    if request.method == 'POST':
        r = {'result': 'fail'}
        username = request.form['user']
        registered_user = User.query.filter_by(username=username).first()
        if registered_user is None:
            password = request.form['pwd']
            u = User(username=username, password=password)
            db.session.add(u)
            db.session.commit()
            r = {'result': 'ok'}
        return jsonify(r)
    else:
        abort(404)


@main.route("/logout")
def logout():
    logout_user()
    flash("You have been logged out.", "success")

    return redirect("/")
