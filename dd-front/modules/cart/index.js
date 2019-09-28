import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';

import ItemType from './types/item';
import ServiceType from './types/service';
import Empty from './components/empty';
import CartTable from './components/table';
import CartActions from './actions';
import RootActions from '../root/actions';
import { getCartItems, getCartServices } from './selectors';
import NotificationsActions from '../notifications/actions';
import PromoModal from './components/promo';

const MAX_WIDTH_MULTIPLIER = 125;

const styles = theme => ({
  buttons: {
    marginLeft: 'auto',
    marginRight: 'auto',
    display: 'flex',
    justifyContent: 'flex-end',
    maxWidth: theme.spacing(MAX_WIDTH_MULTIPLIER)
  },
  button: {
    marginLeft: theme.spacing(1)
  }
});

const Cart = ({
  classes,
  items,
  services,
  onMakeOrder,
  onQtyChange,
  onProductDelete,
  addNotification
}) => {
  const [isPromoOpen, setPromoOpen] = useState(false);

  if (!items.length) {
    return <Empty />;
  }

  const onSubmit = () => {
    const isValid = items.every(item => item.qty <= item.product.qty);
    if (!isValid) {
      addNotification({
        key: 'notEnoughInStock',
        message: 'Нет нужного количества товара в наличии'
      });
      return;
    }

    onMakeOrder('/checkout');
  };

  return (
    <>
      <CartTable
        items={items}
        services={services}
        onQtyChange={onQtyChange}
        onItemDelete={onProductDelete}
      />
      <PromoModal
        open={isPromoOpen}
        onClose={() => setPromoOpen(false)}
        onSubmit={() => setPromoOpen(false)}
      />
      <p className={classes.buttons}>
        <Button variant={'contained'} onClick={() => setPromoOpen(true)}>
          Ввести промокод
        </Button>
        <Button
          onClick={onSubmit}
          className={classes.button}
          color={'primary'}
          variant={'contained'}
        >
          Оформить заказ
        </Button>
      </p>
    </>
  );
};

Cart.propTypes = {
  classes: PropTypes.any,
  items: PropTypes.arrayOf(ItemType).isRequired,
  services: PropTypes.arrayOf(ServiceType).isRequired,
  onMakeOrder: PropTypes.func.isRequired,
  onQtyChange: PropTypes.func.isRequired,
  onProductDelete: PropTypes.func.isRequired,
  addNotification: PropTypes.func.isRequired
};

const mapState = state => ({
  items: getCartItems(state),
  services: getCartServices(state)
});

const mapDispatch = {
  onMakeOrder: RootActions.Creators.redirect,
  onProductDelete: CartActions.Creators.removeFromCart,
  onQtyChange: CartActions.Creators.debouncedCartQtyUpdate,
  addNotification: NotificationsActions.Creators.addNotification
};

export default withStyles(styles)(
  connect(
    mapState,
    mapDispatch
  )(Cart)
);
