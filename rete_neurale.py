import matplotlib.pyplot as plt
import numpy as np
import sys
from sklearn.model_selection import train_test_split
from sklearn.metrics import log_loss, accuracy_score
from sklearn.preprocessing import MinMaxScaler
from sklearn.linear_model import LogisticRegression
from sklearn.neural_network import MLPClassifier
from sklearn.datasets import make_classification
from sklearn.linear_model import SGDClassifier
from sklearn.utils import shuffle

x, y = make_classification(n_samples=1250, n_features=4, n_informative=2, random_state=0)
x_train, x_test, y_train, y_test = train_test_split(x, y, random_state=0, test_size=0.2)

# ---------- SGD CLASSIFIER ----------
sgd = SGDClassifier(loss='log', shuffle=True)
sgd.fit(x_train, y_train)
print('Loss: %.4f' % (log_loss(y_test, sgd.predict_proba(x_test))))


def minibatchGD(train_set, test_set, num_batches=1, epochs=10):
    x_train, y_train = train_set
    x_test, y_test = test_set

    batch_size = x_train.shape[0] / num_batches

    sgd = SGDClassifier(loss='log')
    sgd_loss = []

    for epoch in range(epochs):
        x_shuffled, y_shuffled = shuffle(x_train, y_train)

        for batch in range(num_batches):
            batch_start = int(batch * batch_size)
            batch_end = int((batch + 1) * batch_size)

            x_batch = x_shuffled[batch_start:batch_end]
            y_batch = y_shuffled[batch_start:batch_end]

            sgd.partial_fit(x_batch, y_batch, classes=np.unique(y_train))
            loss = log_loss(y_test, sgd.predict_proba(x_test), labels=np.unique(y_train))
            sgd_loss.append(loss)

        print("Loss all'epoca %d = %.4f" % (epoch + 1, loss))

    return (sgd, sgd_loss)


full_gd, full_gd_loss = minibatchGD((x_train, y_train), (x_test, y_test), num_batches=1, epochs=200)
sgd, sgd_loss = minibatchGD((x_train, y_train), (x_test, y_test), num_batches=x_train.shape[0], epochs=5)
mini_gd, mini_gd_loss = minibatchGD((x_train, y_train), (x_test, y_test), num_batches=10, epochs=50)

plt.rcParams['figure.figsize'] = (14, 10)
plt.plot(sgd_loss, label='Stochastic')
plt.plot(full_gd_loss, label='Stochastic')
plt.plot(mini_gd_loss, label='Stochastic')

plt.xlim(xmin=0, xmax=200)
plt.legend()
